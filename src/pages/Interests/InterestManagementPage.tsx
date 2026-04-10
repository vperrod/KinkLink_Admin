import { useState } from "react";
import { Interest } from "../../types/interest.types";
import AddInterestComp from "../../components/interests/AddInterestComp";
import InterestListComp from "../../components/interests/InterestListComp";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const InterestManagementPage = () => {
    const [editingInterest, setEditingInterest] = useState<Interest | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSuccess = () => {
        setEditingInterest(null);
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleEdit = (interest: Interest) => {
        setEditingInterest(interest);
    };

    const handleCancelEdit = () => {
        setEditingInterest(null);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <PageBreadcrumb
                pageTitle="Interest Management"
                description="Manage interests for users"
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Side - Add/Edit Form */}
                <div className="lg:col-span-1">
                    <AddInterestComp
                        editingInterest={editingInterest}
                        onSuccess={handleSuccess}
                        onCancelEdit={handleCancelEdit}
                    />
                </div>

                {/* Right Side - Interest List */}
                <div className="lg:col-span-2">
                    <InterestListComp
                        refreshTrigger={refreshTrigger}
                        onEdit={handleEdit}
                    />
                </div>
            </div>
        </div>
    );
};

export default InterestManagementPage;
