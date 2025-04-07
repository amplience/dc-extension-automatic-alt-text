import { useEffect, useState } from "react";

import { useExtensionSdk } from "./providers/ExtensionContext";

export function useUiParams() {
  const { ready, schema } = useExtensionSdk();

  const [withHeader, setWithHeader] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!ready || !schema?.["ui:component"]) {
      return;
    }

    if (Object.hasOwn(schema?.["ui:component"]?.params, "withHeader")) {
      setWithHeader(schema?.["ui:component"]?.params?.withHeader);
    }

    if (Object.hasOwn(schema?.["ui:component"]?.params, "collapsed")) {
      setCollapsed(schema?.["ui:component"]?.params?.collapsed);
    }
  }, [ready, schema]);

  return { collapsed, withHeader };
}
