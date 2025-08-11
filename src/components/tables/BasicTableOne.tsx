"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import Image from "next/image";
import { useUsersData } from "./hook";
import { UserModal } from "./UserModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { PlusIcon, EyeIcon, PencilIcon, TrashBinIcon } from "../../icons";

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

export default function BasicTableOne() {
  const { data: tableData, loading, error, createUser, getUserById, updateUser, deleteUser } = useUsersData();
  
  // Modal states
  const [userModal, setUserModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit" | "view";
    userId?: number;
  }>({
    isOpen: false,
    mode: "create",
  });
  
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId?: number;
    userName?: string;
  }>({
    isOpen: false,
  });

  const [actionLoading, setActionLoading] = useState(false);

  // Modal handlers
  const openCreateModal = () => {
    setUserModal({ isOpen: true, mode: "create" });
  };

  const openViewModal = (userId: number) => {
    setUserModal({ isOpen: true, mode: "view", userId });
  };

  const openEditModal = (userId: number) => {
    setUserModal({ isOpen: true, mode: "edit", userId });
  };

  const openDeleteModal = (userId: number, userName: string) => {
    setDeleteModal({ isOpen: true, userId, userName });
  };

  const closeUserModal = () => {
    setUserModal({ isOpen: false, mode: "create" });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false });
  };

  // CRUD operations
  const handleCreateUser = async (userData: { name: string; phone: string; location_id: string }) => {
    const result = await createUser(userData);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const handleUpdateUser = async (userData: { name: string; phone: string; location_id: string }) => {
    if (!userModal.userId) return;
    const result = await updateUser(userModal.userId, userData);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.userId) return;
    setActionLoading(true);
    try {
      const result = await deleteUser(deleteModal.userId);
      if (!result.success) {
        throw new Error(result.error);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleModalSubmit = async (userData: { name: string; phone: string; location_id: string }) => {
    if (userModal.mode === "create") {
      await handleCreateUser(userData);
    } else if (userModal.mode === "edit") {
      await handleUpdateUser(userData);
    }
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Header with Add User Button */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.05]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Users Management
            </h3>
            <Button
              variant="primary"
              size="sm"
              onClick={openCreateModal}
              startIcon={<PlusIcon className="w-4 h-4" />}
            >
              Add User
            </Button>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    User
                  </TableCell>
                  <TableCell
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Phone
                  </TableCell>
                  <TableCell
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Location ID
                  </TableCell>
                  <TableCell
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {tableData.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={order.user.image}
                            alt={order.user.name}
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {order.user.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.user.phone}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.user.location_id}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openViewModal(order.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                          title="View"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(order.id)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors dark:hover:bg-green-900/20 dark:hover:text-green-400"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(order.id, order.user.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          title="Delete"
                        >
                          <TrashBinIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={userModal.isOpen}
        onClose={closeUserModal}
        mode={userModal.mode}
        userId={userModal.userId}
        onSubmit={handleModalSubmit}
        onGetUser={getUserById}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteUser}
        userName={deleteModal.userName || ""}
        loading={actionLoading}
      />
    </>
  );
}
