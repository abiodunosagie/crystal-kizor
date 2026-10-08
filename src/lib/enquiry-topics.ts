// Shared by the form (options) and the Worker (allow-list), so a topic can
// never be offered that the server would reject.
export const enquiryTopics = [
  { value: "studio_project", label: "A project with Studio COKA" },
  { value: "speaking", label: "Speaking or media" },
  { value: "ako_partner", label: "Partnering with AKO Alliance" },
  { value: "tea", label: "The Effective Architect" },
  { value: "elevated", label: "ELEvated furniture" },
  { value: "general", label: "Something else" },
] as const;
