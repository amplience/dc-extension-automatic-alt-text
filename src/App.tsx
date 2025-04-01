import Extension from "./Extension.tsx";
import { ExtensionsProvider } from "./hooks/providers/ExtensionProvider";

export function App() {
  return (
    <ExtensionsProvider>
      <Extension />
    </ExtensionsProvider>
  );
}
