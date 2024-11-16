import { Select, TextInput, Button, Alert } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";

function AddContact() {
  const { theme } = useSelector((state) => state.theme);
  const { currentUser, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const filePickerRef = useRef();
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (value) => {
    setPhone(value);
  };
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      setPublishError("Please provide all required fields.");
      return;
    }

    const slug = formData.name
      ? formData.name.toLowerCase().replace(/\s+/g, "-")
      : new Date().getTime().toString();
    const finalData = {
      ...formData,
      userId: currentUser._id,
      slug: slug,
      email: formData.email || "",
      profilePicture: formData.profilePicture || "",
      phone: formData.phone || "",
      relationship: formData.relationship || "friend",
    };

    try {
      const res = await fetch("/api/contact/addcontact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        toast.success("Contact added!");
        navigate("/dashboard?tab=contacts");
      }
    } catch (error) {
      console.log(error);
      setPublishError("Something went wrong");
    }
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

  return (
    <div className="p-4 max-w-3xl mx-auto min-h-screen">
      <Button onClick={() => navigate(-1)} className="rounded-full shadow-md">
        &#8592; Back
      </Button>
      <h1 className="text-center text-3xl my-7 font-semibold">Add Contact</h1>
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <PhoneInput
          className={`${
            theme === "dark"
              ? "dark:text-gray-200 dark:bg-[rgb(16,23,42)]"
              : "text-gray-700 bg-white"
          }`}
          country={"au"}
          value={phone}
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
          defaultValue="friend"
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
          {loading ? "Adding..." : "Add"}
        </Button>

        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}

export default AddContact;
