import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { addInterestApi, updateInterestApi } from "../../api/interestapi";
import { Interest } from "../../types/interest.types";
import Button from "../ui/button/Button";

type AddInterestCompProps = {
    editingInterest: Interest | null;
    onSuccess: () => void;
    onCancelEdit: () => void;
};

const AddInterestComp = ({ editingInterest, onSuccess, onCancelEdit }: AddInterestCompProps) => {
    const [interestName, setInterestName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (editingInterest) {
            setInterestName(editingInterest.interestName);
        } else {
            setInterestName("");
        }
        setError("");
    }, [editingInterest]);

    const validateForm = (): boolean => {
        if (!interestName.trim()) {
            setError("Interest name is required");
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
            if (editingInterest) {
                // Update existing interest
                await updateInterestApi(editingInterest._id, {
                    interestName: interestName.trim(),
                });
                toast.success("Interest updated successfully");
            } else {
                // Add new interest
                await addInterestApi({
                    interestName: interestName.trim(),
                });
                toast.success("Interest added successfully");
            }
            setInterestName("");
            setError("");
            onSuccess();
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message ||
                (editingInterest ? "Failed to update interest" : "Failed to add interest");
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setInterestName("");
        setError("");
        onCancelEdit();
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                {editingInterest ? "Edit Interest" : "Add New Interest"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="interestName"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Interest Name
                    </label>
                    <input
                        type="text"
                        id="interestName"
                        value={interestName}
                        onChange={(e) => {
                            setInterestName(e.target.value);
                            setError("");
                        }}
                        className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 ${error
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-brand-500 dark:border-gray-700"
                            } dark:bg-gray-800 dark:text-white`}
                        placeholder="Enter interest name"
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
                        {loading ? "Saving..." : editingInterest ? "Update Interest" : "Add Interest"}
                    </Button>
                    {editingInterest && (
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

export default AddInterestComp;
