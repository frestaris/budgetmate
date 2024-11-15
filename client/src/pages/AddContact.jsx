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

function AddContact() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const filePickerRef = useRef();

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
        navigate(`/contact/${data.slug}`);
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
        <TextInput
          type="text"
          placeholder="Phone"
          id="phone"
          required
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
