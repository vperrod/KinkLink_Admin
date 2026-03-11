import { useState, useEffect, useCallback } from "react";
import CreateSubAdminModal from "../../components/admin/CreateSubAdminModal";
import Button from "../../components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { getSubadminsApi, deleteSubadminApi } from "../../api/adminapi";
import toast from "react-hot-toast";

const SubAdminManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subAdmins, setSubAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null);

  const fetchSubAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getSubadminsApi();
      setSubAdmins(response.data || []);
    } catch (error: any) {
      // toast.error(error?.response?.data?.message || "Failed to fetch sub-admins");
      console.error("Error fetching sub-admins:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sub-admin?")) return;

    try {
      await deleteSubadminApi(id);
      toast.success("Sub-admin deleted successfully");
      fetchSubAdmins();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete sub-admin");
    }
  };

  const handleEdit = (admin: any) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
  };

  useEffect(() => {
    fetchSubAdmins();
  }, [fetchSubAdmins]);

  return (
    <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sub-admin Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage platform sub-admins and their permissions</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingAdmin(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <span>+</span> Create Sub-admin
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[15px] shadow-sm border border-gray-50 dark:border-gray-800 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex justify-center py-20 italic text-gray-400">Loading sub-admins...</div>
        ) : subAdmins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Sub-admins Found</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">You haven't created any sub-admins yet.</p>
            <Button variant="primary" onClick={() => { setEditingAdmin(null); setIsModalOpen(true); }}>
              Add First Sub-admin
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableCell isHeader className="px-6 py-5 text-[#6B7280] font-normal text-sm">Name</TableCell>
                  <TableCell isHeader className="px-6 py-5 text-[#6B7280] font-normal text-sm">Email</TableCell>
                  <TableCell isHeader className="px-6 py-5 text-[#6B7280] font-normal text-sm">Phone</TableCell>
                  <TableCell isHeader className="px-6 py-5 text-[#6B7280] font-normal text-sm">Permissions</TableCell>
                  <TableCell isHeader className="px-6 py-5 text-[#6B7280] font-normal text-sm">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subAdmins.map((admin) => (
                  <TableRow key={admin._id} className="border-b border-gray-50 dark:border-gray-800 text-center">
                    <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {admin.firstName} {admin.lastName}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-400">{admin.email}</TableCell>
                    <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-400">{admin.phone}</TableCell>
                    <TableCell className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                      {admin.permissions?.length || 0} Permissions
                    </TableCell>
                    <TableCell className="px-6 py-4 flex items-center gap-3 justify-center">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <CreateSubAdminModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchSubAdmins}
        initialData={editingAdmin}
      />
    </div>
  );
};

export default SubAdminManagement;
