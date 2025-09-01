export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isFromClient: boolean;
  isRead: boolean;
}

export interface Thread {
  id: string;
  clientName: string;
  channel: "whatsapp" | "instagram" | "email" | "sms";
  lastMessage: string;
  lastMessageTime: Date;
  isAssigned: boolean;
  clientId?: string;
  unreadCount: number;
  messages: Message[];
  isLastMessageFromUs: boolean;
}

export interface Case {
  id: string;
  clientId: string;
  service: string;
  value: number;
  dateCreated: Date;
  status: "open" | "closed" | "pending";
}

export interface ClientDetail {
  id: string;
  firstName: string;
  lastName: string;
  dateCreated: Date;
  country: string;
  cityInPoland: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastModified: Date;
}

export const messageTemplates = [
  "Hello! How can I help you today?",
  "Thank you for contacting us. We'll get back to you shortly.",
  "Your request has been received and is being processed.",
  "We're currently reviewing your case and will update you soon.",
  "Is there anything else I can help you with?",
];

export const threads: Thread[] = [
  {
    id: "thread-1",
    clientName: "Anna Kowalski",
    channel: "whatsapp",
    lastMessage: "When will my documents be ready?",
    lastMessageTime: new Date(2025, 8, 1, 14, 30),
    isAssigned: true,
    clientId: "client-101",
    unreadCount: 2,
    isLastMessageFromUs: false,
    messages: [
      {
        id: "msg-1",
        content: "Hello, I need help with my visa application",
        timestamp: new Date(2025, 8, 1, 10, 15),
        isFromClient: true,
        isRead: true,
      },
      {
        id: "msg-2",
        content:
          "Hi Anna! I'll be happy to help you with your visa application. Can you please provide more details about your situation?",
        timestamp: new Date(2025, 8, 1, 10, 20),
        isFromClient: false,
        isRead: true,
      },
      {
        id: "msg-3",
        content:
          "I'm from Ukraine and I need a student visa for my master's degree at University of Warsaw. I have all my documents ready but I'm not sure about the translation requirements.",
        timestamp: new Date(2025, 8, 1, 10, 25),
        isFromClient: true,
        isRead: true,
      },
      {
        id: "msg-4",
        content:
          "Perfect! For student visas, you'll need certified translations of your educational documents. I can help you with the complete process. Let me send you a checklist.",
        timestamp: new Date(2025, 8, 1, 10, 30),
        isFromClient: false,
        isRead: true,
      },
      {
        id: "msg-5",
        content:
          "Thank you so much! That would be really helpful. I'm quite nervous about the whole process.",
        timestamp: new Date(2025, 8, 1, 11, 15),
        isFromClient: true,
        isRead: true,
      },
      {
        id: "msg-6",
        content:
          "Don't worry, we'll guide you through every step. I've sent you the document checklist. Please review it and let me know if you have any questions.",
        timestamp: new Date(2025, 8, 1, 11, 20),
        isFromClient: false,
        isRead: true,
      },
      {
        id: "msg-7",
        content:
          "I've looked at the checklist. I have most documents but I'm missing the health insurance proof. Where can I get this?",
        timestamp: new Date(2025, 8, 1, 13, 45),
        isFromClient: true,
        isRead: true,
      },
      {
        id: "msg-8",
        content:
          "You can get health insurance from several providers in Poland. I recommend PZU or Nationale-Nederlanden. They offer special student packages. Would you like me to send you their contact information?",
        timestamp: new Date(2025, 8, 1, 13, 50),
        isFromClient: false,
        isRead: true,
      },
      {
        id: "msg-9",
        content: "Yes please! And also, when should I schedule my visa appointment?",
        timestamp: new Date(2025, 8, 1, 14, 25),
        isFromClient: true,
        isRead: false,
      },
      {
        id: "msg-10",
        content: "When will my documents be ready?",
        timestamp: new Date(2025, 8, 1, 14, 30),
        isFromClient: true,
        isRead: false,
      },
    ],
  },
  {
    id: "thread-2",
    clientName: "Piotr Nowak",
    channel: "instagram",
    lastMessage: "You: Perfect, I'll send you the forms tomorrow.",
    lastMessageTime: new Date(2025, 8, 1, 11, 45),
    isAssigned: true,
    clientId: "client-102",
    unreadCount: 0,
    isLastMessageFromUs: true,
    messages: [
      {
        id: "msg-4",
        content: "Hi, I saw your post about work permits. Can you help me?",
        timestamp: new Date(2025, 8, 1, 9, 30),
        isFromClient: true,
        isRead: true,
      },
      {
        id: "msg-5",
        content:
          "Absolutely! I can help you with work permit applications. What's your current situation?",
        timestamp: new Date(2025, 8, 1, 9, 35),
        isFromClient: false,
        isRead: true,
      },
      {
        id: "msg-6",
        content: "Perfect, I'll send you the forms tomorrow.",
        timestamp: new Date(2025, 8, 1, 11, 45),
        isFromClient: false,
        isRead: true,
      },
    ],
  },
  {
    id: "thread-3",
    clientName: "Maria Santos",
    channel: "whatsapp",
    lastMessage: "Do I need to translate all my documents?",
    lastMessageTime: new Date(2025, 8, 1, 16, 20),
    isAssigned: false,
    clientId: undefined,
    unreadCount: 1,
    isLastMessageFromUs: false,
    messages: [
      {
        id: "msg-7",
        content: "Do I need to translate all my documents?",
        timestamp: new Date(2025, 8, 1, 16, 20),
        isFromClient: true,
        isRead: false,
      },
    ],
  },
  {
    id: "thread-4",
    clientName: "Jan Wiśniewski",
    channel: "email",
    lastMessage: "You: I've sent you the updated timeline via email.",
    lastMessageTime: new Date(2025, 8, 1, 13, 10),
    isAssigned: true,
    clientId: "client-103",
    unreadCount: 0,
    isLastMessageFromUs: true,
    messages: [
      {
        id: "msg-8",
        content: "What's the timeline for my citizenship application?",
        timestamp: new Date(2025, 8, 1, 12, 30),
        isFromClient: true,
        isRead: true,
      },
      {
        id: "msg-9",
        content: "I've sent you the updated timeline via email.",
        timestamp: new Date(2025, 8, 1, 13, 10),
        isFromClient: false,
        isRead: true,
      },
    ],
  },
  {
    id: "thread-5",
    clientName: "Elena Petrov",
    channel: "whatsapp",
    lastMessage: "Thank you for your help with the documents!",
    lastMessageTime: new Date(2025, 8, 1, 15, 45),
    isAssigned: true,
    clientId: "client-104",
    unreadCount: 1,
    isLastMessageFromUs: false,
    messages: [
      {
        id: "msg-11",
        content: "Thank you for your help with the documents!",
        timestamp: new Date(2025, 8, 1, 15, 45),
        isFromClient: true,
        isRead: false,
      },
    ],
  },
  {
    id: "thread-6",
    clientName: "Dmitri Volkov",
    channel: "instagram",
    lastMessage: "You: I'll prepare the application for you.",
    lastMessageTime: new Date(2025, 8, 1, 12, 15),
    isAssigned: true,
    clientId: "client-105",
    unreadCount: 0,
    isLastMessageFromUs: true,
    messages: [
      {
        id: "msg-12",
        content: "I need help with family reunification visa",
        timestamp: new Date(2025, 8, 1, 11, 30),
        isFromClient: true,
        isRead: true,
      },
      {
        id: "msg-13",
        content: "I'll prepare the application for you.",
        timestamp: new Date(2025, 8, 1, 12, 15),
        isFromClient: false,
        isRead: true,
      },
    ],
  },
  {
    id: "thread-7",
    clientName: "Sofia Ivanova",
    channel: "sms",
    lastMessage: "Can you call me back?",
    lastMessageTime: new Date(2025, 8, 1, 17, 30),
    isAssigned: false,
    clientId: undefined,
    unreadCount: 2,
    isLastMessageFromUs: false,
    messages: [
      {
        id: "msg-14",
        content: "Can you call me back?",
        timestamp: new Date(2025, 8, 1, 17, 30),
        isFromClient: true,
        isRead: false,
      },
    ],
  },
  {
    id: "thread-8",
    clientName: "Alexandru Popescu",
    channel: "email",
    lastMessage: "You: Documents submitted successfully.",
    lastMessageTime: new Date(2025, 8, 1, 16, 45),
    isAssigned: true,
    clientId: "client-106",
    unreadCount: 0,
    isLastMessageFromUs: true,
    messages: [
      {
        id: "msg-15",
        content: "Documents submitted successfully.",
        timestamp: new Date(2025, 8, 1, 16, 45),
        isFromClient: false,
        isRead: true,
      },
    ],
  },
  {
    id: "thread-9",
    clientName: "Oksana Kovalenko",
    channel: "whatsapp",
    lastMessage: "How long does the process take?",
    lastMessageTime: new Date(2025, 8, 1, 18, 15),
    isAssigned: true,
    clientId: "client-107",
    unreadCount: 1,
    isLastMessageFromUs: false,
    messages: [
      {
        id: "msg-16",
        content: "How long does the process take?",
        timestamp: new Date(2025, 8, 1, 18, 15),
        isFromClient: true,
        isRead: false,
      },
    ],
  },
  {
    id: "thread-10",
    clientName: "Viktor Petrov",
    channel: "instagram",
    lastMessage: "Thank you for the quick response!",
    lastMessageTime: new Date(2025, 8, 1, 19, 20),
    isAssigned: false,
    clientId: undefined,
    unreadCount: 1,
    isLastMessageFromUs: false,
    messages: [
      {
        id: "msg-17",
        content: "Thank you for the quick response!",
        timestamp: new Date(2025, 8, 1, 19, 20),
        isFromClient: true,
        isRead: false,
      },
    ],
  },
];

export const cases: Case[] = [
  {
    id: "case-001",
    clientId: "client-101",
    service: "Visa Application",
    value: 2500,
    dateCreated: new Date(2025, 7, 15),
    status: "open",
  },
  {
    id: "case-002",
    clientId: "client-102",
    service: "Work Permit",
    value: 3200,
    dateCreated: new Date(2025, 7, 20),
    status: "pending",
  },
  {
    id: "case-003",
    clientId: "client-103",
    service: "Citizenship Application",
    value: 4500,
    dateCreated: new Date(2025, 7, 25),
    status: "open",
  },
];

export const clientDetails: ClientDetail[] = [
  {
    id: "client-101",
    firstName: "Anna",
    lastName: "Kowalski",
    dateCreated: new Date(2025, 6, 10),
    country: "Ukraine",
    cityInPoland: "Warsaw",
  },
  {
    id: "client-102",
    firstName: "Piotr",
    lastName: "Nowak",
    dateCreated: new Date(2025, 6, 15),
    country: "Belarus",
    cityInPoland: "Krakow",
  },
  {
    id: "client-103",
    firstName: "Jan",
    lastName: "Wiśniewski",
    dateCreated: new Date(2025, 6, 20),
    country: "Russia",
    cityInPoland: "Gdansk",
  },
];

export const knowledgeBase: Document[] = [
  {
    id: "doc-1",
    title: "Visa Application Requirements",
    content:
      "To apply for a Polish visa, you need to prepare several documents including a valid passport, completed application form, passport photos, proof of financial means, travel insurance, and accommodation confirmation. The processing time typically takes 15-30 business days depending on the type of visa requested.",
    tags: ["visa", "requirements", "documents", "poland"],
    lastModified: new Date(2025, 7, 1),
  },
  {
    id: "doc-2",
    title: "Work Permit Process",
    content:
      "Work permit applications in Poland require employer sponsorship and several supporting documents. The employer must first obtain a work permit declaration from the local employment office. Required documents include employment contract, educational certificates, criminal background check, and medical certificate.",
    tags: ["work permit", "employment", "sponsorship", "poland"],
    lastModified: new Date(2025, 7, 5),
  },
  {
    id: "doc-3",
    title: "Citizenship Application Guide",
    content:
      "Polish citizenship can be obtained through naturalization after meeting residency requirements. Applicants must demonstrate Polish language proficiency, knowledge of Polish history and culture, and have a clean criminal record. The process involves submitting an application to the provincial governor and can take 12-24 months.",
    tags: ["citizenship", "naturalization", "language", "residency"],
    lastModified: new Date(2025, 7, 10),
  },
  {
    id: "doc-4",
    title: "Document Translation Requirements",
    content:
      "All foreign documents submitted for Polish immigration procedures must be translated by a sworn translator certified in Poland. The translation must include the translator's signature and official seal. Documents in English may be accepted in some cases, but it's recommended to have them translated to avoid delays.",
    tags: ["translation", "documents", "sworn translator", "certification"],
    lastModified: new Date(2025, 7, 12),
  },
];
