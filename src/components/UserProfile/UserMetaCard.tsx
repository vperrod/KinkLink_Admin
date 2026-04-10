import { useEffect, useRef, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useProfile } from "../../context/ProfileContext";
import type { Profile } from "../../types/profile.types";
import { adminProfileImage } from "../../utils/image";

export default function UserMetaCard() {
  const { profile, updateProfile } = useProfile();
  const { isOpen, openModal, closeModal } = useModal();
  const fileRef = useRef<HTMLInputElement | null>(null);

  //  form state
  const [form, setForm] = useState<Partial<Profile>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  //  Prefill form
  useEffect(() => {
    if (profile && isOpen) {
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        profileImage: profile.profileImage,
      });
      setPreview(null);
      setImageFile(null);
      setRemoveImage(false);
    }
  }, [profile, isOpen]);

  //  Image select
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setRemoveImage(false);

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  //  Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreview(null);
    setRemoveImage(true);
    setForm((p) => ({ ...p, profileImage: null }));
  };

  //  Save
  const handleSave = async () => {
    const formData = new FormData();

    if (form.firstName) formData.append("firstName", form.firstName);
    if (form.lastName) formData.append("lastName", form.lastName);
    if (form.phone) formData.append("phone", form.phone);

    //  IMAGE UPLOAD
    if (imageFile) {
      formData.append("adminProfileImg", imageFile);
    }

    //  IMAGE REMOVE
    if (removeImage) {
      formData.append("removeImage", "true");
      // OR: formData.append("profileImage", "");
    }

    await updateProfile(formData as any);
    closeModal();
  };

  if (!profile) return null;

  return (
    <>
      {/* ================= VIEW CARD ================= */}
      <div className="p-5 border rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={
                profile.profileImage
                  ? adminProfileImage(profile.profileImage)
                  : "/images/user/owner.jpg"
              }
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold">
                {profile.firstName} {profile.lastName}
              </h4>
              <p className="text-sm text-gray-500">{profile.role}</p>
            </div>
          </div>

          <Button onClick={openModal}>
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </Button>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="bg-white rounded-3xl p-6">
          <h4 className="text-2xl font-semibold mb-4">
            Edit Personal Information
          </h4>

          {/*  IMAGE */}
          <div className="relative w-24 h-24 mb-6">
            <img
              src={
                preview
                  ? preview
                  : form.profileImage
                    ? adminProfileImage(form.profileImage)
                    : "/images/user/owner.jpg"
              }
              className="w-24 h-24 rounded-full object-cover border"
            />

            {(form.profileImage || preview) && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />

          <Button
            size="sm"
            variant="outline"
            onClick={() => fileRef.current?.click()}
          >
            Change Photo
          </Button>

          {/*  FORM */}
          <form
            className="grid grid-cols-1 gap-5 lg:grid-cols-2 mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div>
              <Label>First Name</Label>
              <Input
                value={form.firstName ?? ""}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                value={form.lastName ?? ""}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input value={form.email ?? ""} disabled />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone ?? ""}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>

            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
