import { ExtensionsProvider } from "./hooks/providers/ExtensionProvider";
import { useExtension } from "./hooks/useExtension";

function Extension() {
  const { ready, dcExtensionsSdk, schema } = useExtension();

  return (
    <>
      <ExtensionsProvider dcExtensionsSdk={dcExtensionsSdk}>
        {ready ? (
          <>
            <p>Form field input data:</p>
            <pre>
              <code>{JSON.stringify(schema, null, 2)}</code>
            </pre>
          </>
        ) : (
          <>Not ready</>
        )}
      </ExtensionsProvider>
    </>
  );
}

export default Extension;
