
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { LibraryContext } from "../../context/LibraryContext";
import MemberTable from "../../components/members/MemberTable";
import Modal from "../../components/common/Modal";

const Members = () => {
  const { members, deleteMember } = useContext(LibraryContext);

 const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    showCancel: false,
    confirmText: "OK",
    onConfirm: null,
  });

  const closeModal = () => {
    setModal((previous) => ({
      ...previous,
      isOpen: false,
      onConfirm: null,
    }));
  };

  const handleDeleteMember = (member) => {
    setModal({
      isOpen: true,
      title: "Delete Member?",
      message: `Are you sure you want to delete "${member.name}"? This action cannot be undone.`,
      type: "warning",
      showCancel: true,
      confirmText: "Delete",

      onConfirm: () => {
        const result = deleteMember(member.id);

        if (!result.success) {
          setModal({
            isOpen: true,
            title: "Delete Failed",
            message: result.message,
            type: "error",
            showCancel: false,
            confirmText: "OK",
            onConfirm: closeModal,
          });

          return;
        }

        setModal({
          isOpen: true,
          title: "Success!",
          message: "Member deleted successfully.",
          type: "success",
          showCancel: false,
          confirmText: "OK",
          onConfirm: closeModal,
        });
      },
    });
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Members
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all registered library members.
          </p>
        </div>

        <Link
          to="/members/add"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Add Member
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Total Members
        </p>

        <p className="mt-2 text-3xl font-bold text-gray-900">
          {members.length}
        </p>
      </div>

      <MemberTable
        members={members}
        onDelete={handleDeleteMember}
      />
       <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        showCancel={modal.showCancel}
        confirmText={modal.confirmText}
        onConfirm={() => {
          if (modal.onConfirm) {
            modal.onConfirm();
          } else {
            closeModal();
          }
        }}
        onCancel={closeModal}
      />
    </div>
  );
}

export default Members;
