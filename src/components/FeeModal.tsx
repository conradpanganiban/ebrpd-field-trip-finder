import * as React from "react";
import { Program } from "@/types/program";

interface FeeModalProps {
  program: Program;
  isOpen: boolean;
  onClose: () => void;
}

export const FeeModal = ({ program, isOpen, onClose }: FeeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay that covers the entire page */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Modal content */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative z-10">
        <h2 className="text-lg font-semibold">Fee Information</h2>
        <p className="mt-2">
          <strong>Program:</strong> {program.program_name}
        </p>
        <p>
          <strong>Location:</strong> {program.program_host} {program.city && `- ${program.city}`}
        </p>

        {/* Logic for different fee scenarios */}
        {program.id === "bigbreak-7" ? (
          <p>
            Call 510-544-2753 for program details and pricing.
          </p>
        ) : program.fee === "yes" ? (
          <>
            <p>
              <strong>Fee:</strong>{" "}
              {program.id === "blackdiamond-10" ? "$3 per participant" : "$3-$7 per person"}
            </p>
            <p className="mt-2">
              <a
                href="https://www.ebparks.org/sites/default/files/2026-fee-schedule.pdf?v=2"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "#506F33" }} // Custom color applied
              >
                View the current fee schedule
              </a>
            </p>
            <p>
              There is an additional $61/hour per Naturalist for private schools, non-district schools, and for-profit organizations.
            </p>
          </>
        ) : (
          <p>
            Free to public schools in Alameda and Contra Costa Counties, 501(c)(3) non-profits, and government agencies.
            &nbsp;<br />
            $61/hour per Naturalist for private schools, non-district schools, and for-profit organizations.
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: "#506F33" }} // Custom color applied
        >
          Close
        </button>
      </div>
    </div>
  );
};
