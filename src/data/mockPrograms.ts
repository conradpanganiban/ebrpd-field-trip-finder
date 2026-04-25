
import { Program } from "@/types/program";
import { getEmojisForProgram, getNotoEmojiClass } from '@/utils/emojiUtils';

export const mockPrograms: Program[] = [
  {
    id: "1",
    program_name: "Nature Explorer Workshop",
    description: "Interactive outdoor program teaching students about local ecosystems and wildlife through hands-on activities.",
    grade: "3-5",
    duration: "4 hours",
    max_participants: "30",
    visitor_center: "Tilden Environmental Education Center",
    days_not_available: ["Monday", "Wednesday", "Friday"],
    format: "In Person",
    months_not_available: ["July", "August", "September"],
    specific_timing: "10:00 AM - 2:00 PM",
    fee: "yes",
    learning_standards: "2-LS4-1, 3-LS4-3, 4-LS1-1",
    city: "Oakland",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    application_dates: "Spring 2025 - open",
    limited_availability: {
      days: ["Monday", "Wednesday", "Friday"],
      months: ["July", "August", "September"]
    },
    application_status: [
      {
        season: "Spring 2025",
        status: "open",
        isOverride: false
      }
    ],
    program_host: "Tilden Environmental Education Center",
    accepting_applications: "Spring 2025",
    link_suffix: "&OPP_STATE=CA&Program_Request_School_Program_Location_School_Program_Location="
  },
  {
    id: "2",
    program_name: "Virtual Science Lab",
    description: "Engaging virtual laboratory experiments with real-time interaction and expert guidance.",
    grade: "6-8",
    duration: "1 hour",
    max_participants: "50",
    visitor_center: "Mobile Education",
    days_not_available: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    format: "virtual",
    months_not_available: [],
    specific_timing: null,
    fee: "yes",
    learning_standards: "MS-PS1-2, MS-PS1-4",
    city: "Any",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    application_dates: "Spring 2025 - open",
    limited_availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      months: []
    },
    application_status: [
      {
        season: "Spring 2025",
        status: "open",
        isOverride: false
      }
    ],
    program_host: "Mobile Education",
    accepting_applications: "Spring 2025",
    link_suffix: "&OPP_STATE=CA&Program_Request_School_Program_Location_School_Program_Location="
  },
  {
    id: "3",
    program_name: "Historical Time Travel",
    description: "Journey through local history with period-accurate reenactments and artifacts.",
    grade: "K-2",
    duration: "3 hours",
    max_participants: "25",
    visitor_center: "Ardenwood Historic Farm",
    days_not_available: ["Tuesday", "Thursday"],
    format: "In Person",
    months_not_available: ["June", "July", "August"],
    specific_timing: "9:30 AM - 12:30 PM",
    fee: "yes",
    learning_standards: "K-2.HSS.1.1, K-2.HSS.1.2",
    city: "Berkeley",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    application_dates: "Spring 2025 - open",
    limited_availability: {
      days: ["Tuesday", "Thursday"],
      months: ["June", "July", "August"]
    },
    application_status: [
      {
        season: "Spring 2025",
        status: "open",
        isOverride: false
      }
    ],
    program_host: "Ardenwood Historic Farm",
    accepting_applications: "Spring 2025",
    link_suffix: "&OPP_STATE=CA&Program_Request_School_Program_Location_School_Program_Location="
  }
];
