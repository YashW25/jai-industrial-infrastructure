import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EnvValidator } from "@/components/EnvValidator";

createRoot(document.getElementById("root")!).render(
    <EnvValidator>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </EnvValidator>
);
