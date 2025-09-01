export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  stage: string;
  responsiblePeople: string[];
  attachments: string[];
  createdAt: Date;
  completedAt?: Date;
}

export interface TaskStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface TaskList {
  id: string;
  name: string;
  isShared: boolean;
  owner: string;
  sharedWith: string[];
  tasks: Task[];
  stages: TaskStage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskListMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const taskMembers: TaskListMember[] = [
  {
    id: "user-1",
    name: "You",
    email: "you@company.com",
    avatar: "👤",
  },
  {
    id: "user-2",
    name: "Anna Kowalski",
    email: "anna@company.com",
    avatar: "👩",
  },
  {
    id: "user-3",
    name: "Piotr Nowak",
    email: "piotr@company.com",
    avatar: "👨",
  },
  {
    id: "user-4",
    name: "Maria Santos",
    email: "maria@company.com",
    avatar: "👩‍💼",
  },
];

export const defaultStages: TaskStage[] = [
  {
    id: "stage-1",
    name: "To Do",
    color: "#64748b",
    order: 1,
  },
  {
    id: "stage-2",
    name: "In Progress",
    color: "#f59e0b",
    order: 2,
  },
  {
    id: "stage-3",
    name: "Review",
    color: "#8b5cf6",
    order: 3,
  },
  {
    id: "stage-4",
    name: "Done",
    color: "#10b981",
    order: 4,
  },
];

export const taskLists: TaskList[] = [
  {
    id: "list-1",
    name: "Client Onboarding",
    isShared: false,
    owner: "user-1",
    sharedWith: [],
    stages: [...defaultStages],
    tasks: [
      {
        id: "task-1",
        title: "Review client documents",
        description:
          "Check all submitted documents for completeness and accuracy. Verify identity documents, proof of address, and any relevant certificates.",
        dueDate: new Date(2025, 8, 5),
        stage: "stage-1",
        responsiblePeople: ["user-1"],
        attachments: ["passport_scan.pdf", "proof_of_address.pdf"],
        createdAt: new Date(2025, 8, 1),
      },
      {
        id: "task-2",
        title: "Schedule initial consultation",
        description:
          "Set up a meeting with the client to discuss their needs and requirements in detail.",
        dueDate: new Date(2025, 8, 3),
        stage: "stage-2",
        responsiblePeople: ["user-1", "user-2"],
        attachments: [],
        createdAt: new Date(2025, 8, 1),
      },
      {
        id: "task-3",
        title: "Prepare service agreement",
        description:
          "Draft the service agreement based on client requirements and company policies.",
        dueDate: new Date(2025, 8, 7),
        stage: "stage-1",
        responsiblePeople: ["user-1"],
        attachments: ["agreement_template.docx"],
        createdAt: new Date(2025, 8, 2),
      },
    ],
    createdAt: new Date(2025, 7, 25),
    updatedAt: new Date(2025, 8, 2),
  },
  {
    id: "list-2",
    name: "Visa Applications",
    isShared: true,
    owner: "user-1",
    sharedWith: ["user-2", "user-3"],
    stages: [...defaultStages],
    tasks: [
      {
        id: "task-4",
        title: "Process student visa application",
        description:
          "Complete the student visa application for Anna Kowalski. Ensure all educational documents are properly translated and certified.",
        dueDate: new Date(2025, 8, 10),
        stage: "stage-2",
        responsiblePeople: ["user-2"],
        attachments: ["diploma_translation.pdf", "university_acceptance.pdf"],
        createdAt: new Date(2025, 7, 28),
      },
      {
        id: "task-5",
        title: "Submit work permit documents",
        description:
          "Submit work permit application to the relevant authorities. Follow up on processing status.",
        dueDate: new Date(2025, 8, 8),
        stage: "stage-3",
        responsiblePeople: ["user-3"],
        attachments: ["work_contract.pdf", "employer_certificate.pdf"],
        createdAt: new Date(2025, 7, 30),
      },
      {
        id: "task-6",
        title: "Client interview preparation",
        description:
          "Prepare client for embassy interview. Review common questions and required documentation.",
        dueDate: null,
        stage: "stage-1",
        responsiblePeople: ["user-1", "user-2"],
        attachments: ["interview_guide.pdf"],
        createdAt: new Date(2025, 8, 1),
      },
    ],
    createdAt: new Date(2025, 7, 20),
    updatedAt: new Date(2025, 8, 1),
  },
  {
    id: "list-3",
    name: "Office Management",
    isShared: true,
    owner: "user-1",
    sharedWith: ["user-2", "user-3", "user-4"],
    stages: [...defaultStages],
    tasks: [
      {
        id: "task-7",
        title: "Update company website",
        description:
          "Update the services section of the website with new immigration law changes and service offerings.",
        dueDate: new Date(2025, 8, 12),
        stage: "stage-1",
        responsiblePeople: ["user-4"],
        attachments: ["website_mockup.png", "content_updates.docx"],
        createdAt: new Date(2025, 8, 1),
      },
      {
        id: "task-8",
        title: "Staff training session",
        description:
          "Organize training session on new EU immigration regulations that came into effect this month.",
        dueDate: new Date(2025, 8, 15),
        stage: "stage-1",
        responsiblePeople: ["user-1", "user-2"],
        attachments: ["training_materials.pptx"],
        createdAt: new Date(2025, 8, 2),
      },
    ],
    createdAt: new Date(2025, 7, 15),
    updatedAt: new Date(2025, 8, 2),
  },
];
