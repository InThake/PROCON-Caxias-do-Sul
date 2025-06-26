import {
  Calendar,
  Home,
  User,
  ClipboardCheck,
  Table,
  Columns3,
  PieChart,
  Fingerprint,
  TriangleDashed,
  ClipboardCopy,
  ListTodo,
} from "lucide-react";

export const NAV_DATA = [
  {
    label: "MENU",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Home,
        items: [],
      },
      {
        title: "Reclamações",
        url: "/reclamacoes",
        icon: ListTodo,
        items: [],
      },
      {
        title: "Calendário",
        url: "/calendar",
        icon:  Calendar,
        items: [],
      },
      {
        title: "Perfil",
        url: "/profile",
        icon: User,
        items: [],
      },
      {
        title: "Formulários",
        icon: ClipboardCheck,
        items: [
          {
            title: "Elementos do Formulário",
            icon: ClipboardCopy,
            url: "/forms/form-elements",
          },
          {
            title: "Form Layout",
            url: "/forms/form-layout",
          },
        ],
      },
      {
        title: "Tabelas",
        url: "/tables",
        icon: Table,
        items: [
          {
            title: "Tabelas",
            url: "/tables",
          },
        ],
      },
      {
        title: "Pages",
        icon: Columns3,
        items: [
          {
            title: "Settings",
            url: "/pages/settings",
          },
        ],
      },
    ],
  },
  {
    label: "Outros",
    items: [
      {
        title: "Gráficos",
        icon: PieChart,
        items: [
          {
            title: "Gráfico Básico",
            url: "/charts/basic-chart",
          },
        ],
      },
      {
        title: "UI Elements",
        icon: TriangleDashed,
        items: [
          {
            title: "Alerts",
            url: "/ui-elements/alerts",
          },
          {
            title: "Buttons",
            url: "/ui-elements/buttons",
          },
        ],
      },
      {
        title: "Authentication",
        icon: Fingerprint,
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
        ],
      },
    ],
  },
];
