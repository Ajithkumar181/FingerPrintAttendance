import React, { useEffect } from 'react';

const PresentStudentsModal = ({ isOpen, onClose, students }) => {
  // Escape key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
  className="fixed inset-0 z-50 backdrop-blur-sm bg-transparent flex items-center justify-center px-4 sm:px-0"
  onClick={onClose}
>

      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()} // ✅ Prevent modal click from closing
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
          aria-label="Close modal"
        >
          ❌
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          ✅ Present Students
        </h2>

        {students.length === 0 ? (
          <p className="text-gray-600">No students marked present.</p>
        ) : (
          <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            {students.map((student) => (
              <li key={student.student_id} className="py-3 px-2">
                <div className="text-sm font-medium text-gray-800">
                  {student.name}
                </div>
                <div className="text-xs text-gray-500">
                  {student.class} – Roll No: {student.roll_number}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PresentStudentsModal;
