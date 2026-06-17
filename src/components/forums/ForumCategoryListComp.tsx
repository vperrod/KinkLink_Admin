import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getForumCategoryListApi, deleteForumCategoryApi } from "../../api/forumapi";
import { ForumCategory } from "../../types/forum.types";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Button from "../ui/button/Button";
import Pagination from "../ui/pagination/Pagination";

type ForumCategoryListCompProps = {
    refreshTrigger: number;
    onEdit: (category: ForumCategory) => void;
};

const ForumCategoryListComp = ({ refreshTrigger, onEdit }: ForumCategoryListCompProps) => {
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCategories, setTotalCategories] = useState(0);
    const ITEMS_PER_PAGE = 10;

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getForumCategoryListApi({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            });

            let categoriesList: ForumCategory[] = [];
            let total = 0;

            if (Array.isArray(data)) {
                categoriesList = data;
                total = data.length;
            } else if (data && typeof data === "object") {
                // Check for 'data' key first
                if ("data" in data && Array.isArray(data.data)) {
                    categoriesList = data.data;
                    total = ("total" in data && typeof data.total === "number") ? data.total : data.data.length;
                } 
                // Check for 'categories' key
                else if ("categories" in data && Array.isArray(data.categories)) {
                    categoriesList = data.categories;
                    total = ("total" in data && typeof data.total === "number") ? data.total : data.categories.length;
                }
            }

            setCategories(categoriesList);
            setTotalCategories(total);

        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch forum categories");
        } finally {
            setLoading(false);
        }
    }, [currentPage, ITEMS_PER_PAGE]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories, refreshTrigger]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete category "${name}"?`)) {
            return;
        }

        setDeletingId(id);
        try {
            await deleteForumCategoryApi(id);
            toast.success("Category deleted successfully");
            fetchCategories(); // Refresh list
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to delete category");
        } finally {
            setDeletingId(null);
        }
    };

    const totalPages = Math.ceil(totalCategories / ITEMS_PER_PAGE) || 1;

    if (loading && categories.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Category List
            </h2>

            {categories.length === 0 && !loading ? (
                <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                    No categories found. Add your first forum category!
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50 dark:bg-gray-800">
                                <TableRow>
                                    <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        #
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Category Name
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Description
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Created At
                                    </TableCell>
                                    <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {categories.map((category, index) => (
                                    <TableRow key={category._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {category.name}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                            <span title={category.description}>{category.description}</span>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {category.createdAt
                                                ? new Date(category.createdAt).toLocaleDateString()
                                                : "-"}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onEdit(category)}
                                                    disabled={deletingId === category._id}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(category._id, category.name)}
                                                    disabled={deletingId === category._id}
                                                >
                                                    {deletingId === category._id ? "Deleting..." : "Delete"}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    {!loading && totalCategories > ITEMS_PER_PAGE && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={totalCategories}
                            itemsPerPage={ITEMS_PER_PAGE}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ForumCategoryListComp;
