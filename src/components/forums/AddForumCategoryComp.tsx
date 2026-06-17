import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createForumCategoryApi, updateForumCategoryApi } from "../../api/forumapi";
import { ForumCategory } from "../../types/forum.types";
import Button from "../ui/button/Button";

type AddForumCategoryCompProps = {
    editingCategory: ForumCategory | null;
    onSuccess: () => void;
    onCancelEdit: () => void;
};

const AddForumCategoryComp = ({ editingCategory, onSuccess, onCancelEdit }: AddForumCategoryCompProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (editingCategory) {
            setName(editingCategory.name);
            setDescription(editingCategory.description);
        } else {
            setName("");
            setDescription("");
        }
        setError("");
    }, [editingCategory]);

    const validateForm = (): boolean => {
        if (!name.trim()) {
            setError("Category name is required");
            return false;
        }
        if (!description.trim()) {
            setError("Category description is required");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            if (editingCategory) {
                // Update existing category
                await updateForumCategoryApi(editingCategory._id, {
                    name: name.trim(),
                    description: description.trim(),
                });
                toast.success("Category updated successfully");
            } else {
                // Add new category
                await createForumCategoryApi({
                    name: name.trim(),
                    description: description.trim(),
                });
                toast.success("Category added successfully");
            }
            setName("");
            setDescription("");
            setError("");
            onSuccess();
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message ||
                (editingCategory ? "Failed to update category" : "Failed to add category");
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setName("");
        setDescription("");
        setError("");
        onCancelEdit();
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="categoryName"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Category Name
                    </label>
                    <input
                        type="text"
                        id="categoryName"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError("");
                        }}
                        className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${error && !name.trim()
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-brand-500 dark:border-gray-700"
                            } dark:bg-gray-800 dark:text-white`}
                        placeholder="Enter category name"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label
                        htmlFor="categoryDescription"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Description
                    </label>
                    <textarea
                        id="categoryDescription"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setError("");
                        }}
                        rows={4}
                        className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${error && !description.trim()
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-brand-500 dark:border-gray-700"
                            } dark:bg-gray-800 dark:text-white`}
                        placeholder="Enter category description"
                        disabled={loading}
                    />
                    {error && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    )}
                </div>

                <div className="flex gap-3">
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? "Saving..." : editingCategory ? "Update Category" : "Add Category"}
                    </Button>
                    {editingCategory && (
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddForumCategoryComp;
