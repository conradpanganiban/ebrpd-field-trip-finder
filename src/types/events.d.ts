// Define custom event types
interface FilterProgramHostEvent extends CustomEvent {
  detail: {
    programHost: string;
  };
}

// Extend the Window interface to include our custom events
interface WindowEventMap {
  'filterProgramHost': FilterProgramHostEvent;
} 