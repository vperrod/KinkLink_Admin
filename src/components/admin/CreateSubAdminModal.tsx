import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import InputField from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { SUB_ADMIN_PERMISSIONS } from "../../config/permissions";
import { createSubadminApi, updateSubadminApi, SubAdminPayload } from "../../api/adminapi";
import toast from "react-hot-toast";

interface CreateSubAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const CreateSubAdminModal: React.FC<CreateSubAdminModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [formData, setFormData] = useState<SubAdminPayload>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    permissions: [],
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        password: "", // Don't pre-fill password on edit
        phone: initialData.phone || "",
        permissions: initialData.permissions || [],
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        permissions: [],
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (key: string, checked: boolean) => {
    setFormData((prev) => {
      const newPermissions = checked
        ? [...prev.permissions, key]
        : prev.permissions.filter((p) => p !== key);
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || (!initialData && !formData.password) || !formData.phone) {
        toast.error("Please fill all required fields");
        return;
    }
    if (formData.permissions.length === 0) {
        toast.error("Please select at least one permission");
        return;
    }

    setLoading(true);
    try {
      if (initialData) {
        // Remove password from payload if empty (don't update password)
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        
        await updateSubadminApi(initialData._id, payload);
        toast.success("Sub-admin updated successfully");
      } else {
        await createSubadminApi(formData);
        toast.success("Sub-admin created successfully");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || `Failed to ${initialData ? "update" : "create"} sub-admin`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6 sm:p-10">
      <div className="flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {initialData ? "Edit Sub-admin" : "Create New Sub-admin"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[70vh] pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <InputField
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <InputField
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <InputField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Password</Label>
              <InputField
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={initialData ? "Leave blank to keep current" : "Password"}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <InputField
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
              />
            </div>
          </div>

          <div>
            <Label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Permissions
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              {SUB_ADMIN_PERMISSIONS.map((perm) => (
                <div key={perm.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`perm-${perm.key}`}
                    checked={formData.permissions.includes(perm.key)}
                    onChange={(checked) => handlePermissionChange(perm.key, checked)}
                  />
                  <label
                    htmlFor={`perm-${perm.key}`}
                    className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    {perm.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Sub-admin" : "Create Sub-admin")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateSubAdminModal;
