import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Alert, Button, Select, TextInput } from "flowbite-react";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";

function Contact() {
  const { theme } = useSelector((state) => state.theme);
  const { contactSlug } = useParams();
  const [contact, setContact] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [phone, setPhone] = useState("");
  const filePickerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/contact/getcontacts?slug=${contactSlug}`);
        const data = await res.json();
        if (!res.ok || !data.contacts.length) {
          setError("Contact not found");
          setLoading(false);
          return;
        }

        setContact(data.contacts[0]);
        setFormData({
          name: data.contacts[0].name,
          email: data.contacts[0].email,
          phone: data.contacts[0].phone,
          relationship: data.contacts[0].relationship || "friend",
          profilePicture: data.contacts[0].profilePicture || "",
        });
        setLoading(false);
      } catch (error) {
        setError("Error fetching contact");
        setLoading(false);
        console.log("Error fetching contact:", error.message);
      }
    };
    fetchContact();
  }, [contactSlug]);

  const handlePhoneChange = (value) => {
    setPhone(value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        console.log(error);
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setImageFileUploadProgress(null);
          setFormData({ ...formData, profilePicture: downloadUrl });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const hasChanges =
      formData.name !== contact.name ||
      formData.email !== contact.email ||
      formData.phone !== contact.phone ||
      formData.relationship !== contact.relationship ||
      formData.profilePicture !== contact.profilePicture;

    if (!hasChanges) {
      toast.info("No changes made");
      setLoading(false);
      return;
    }

    if (!formData.name || !formData.phone) {
      setPublishError("Name and phone are required.");
      setLoading(false);
      return;
    }

    const generateSlug = (name) => {
      return name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
    };

    const updatedContact = {
      ...formData,
      slug: generateSlug(formData.name),
      phone,
      profilePicture: imageFileUrl || formData.profilePicture,
    };

    try {
      const res = await fetch(`/api/contact/updatecontact/${contact._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContact),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Contact updated successfully!");
        setPublishError(null);
        navigate(`/contact/${data.slug}`);
      } else {
        setPublishError(data.message || "Error updating contact");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setPublishError("Error updating contact");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading contact...</p>;
  }

  if (error) {
    return <Alert color="failure">{error}</Alert>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto min-h-screen">
      <Button onClick={() => navigate(-1)} className="rounded-full shadow-md">
        &#8592; Back
      </Button>
      <h1 className="text-center text-3xl my-7 font-semibold">Edit Contact</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(0, 255, 255, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={
              imageFileUrl ||
              formData.profilePicture ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="contact"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          value={formData.name || ""}
          placeholder="Name"
          required
          id="name"
          className="flex-1"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextInput
          type="email"
          placeholder="Email"
          id="email"
          className="flex-1"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <PhoneInput
          className={`${
            theme === "dark"
              ? "dark:text-gray-200 dark:bg-[rgb(16,23,42)]"
              : "text-gray-700 bg-white"
          }`}
          country={"au"}
          value={phone || formData.phone || ""}
          onChange={(value) => {
            handlePhoneChange(value);
            setFormData({ ...formData, phone: value });
          }}
          placeholder="Phone"
          id="phone"
          required
          inputStyle={{
            width: "100%",
            height: "2.5rem",
            borderRadius: "0.375rem",
            padding: "0.5rem 0.75rem",
            fontSize: "1rem",
            outline: "none",
            paddingLeft: "2.75rem",
            color: theme === "dark" ? "rgb(226, 232, 240)" : "rgb(55, 65, 81)",
            backgroundColor:
              theme === "dark" ? "rgb(55, 65, 81)" : "rgb(255, 255, 255)",
          }}
          containerStyle={{
            position: "relative",
            width: "100%",
            display: "flex",
          }}
          enableSearch
          dropdownStyle={{
            color: "rgb(55, 65, 81)",
          }}
        />
        <Select
          id="relationship"
          value={formData.relationship || "friend"}
          onChange={(e) =>
            setFormData({ ...formData, relationship: e.target.value })
          }
        >
          <option value="friend">Friend</option>
          <option value="father">Father</option>
          <option value="mother">Mother</option>
          <option value="sibling">Sibling</option>
          <option value="cousin">Cousin</option>
          <option value="grandparent">Grandparent</option>
        </Select>

        <Button type="submit" gradientDuoTone="cyanToBlue" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
      {publishError && (
        <Alert color="failure" className="mt-2">
          {publishError}
        </Alert>
      )}
    </div>
  );
}

export default Contact;
