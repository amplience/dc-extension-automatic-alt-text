import { useState } from "react";
import { Popover } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { theme } from "@amplience/ui-styles";

export function InfoPopover({ paragraphs }: { paragraphs: string[] }) {
  const [opened, setOpened] = useState(false);
  return (
    <Popover opened={opened} onChange={setOpened}>
      <Popover.Target>
        <IconInfoCircle
          onClick={() => setOpened((o) => !o)}
          size={theme?.other?.iconSizes?.md}
          stroke={theme?.other?.iconStrokes?.md}
          style={{
            stroke: theme.white,
            fill: theme.other?.colors?.information.information_100,
            cursor: "pointer",
            minWidth: "16px",
            minHeight: "16px",
          }}
        ></IconInfoCircle>
      </Popover.Target>

      <Popover.Dropdown
        style={{
          maxWidth: "32rem",
          wordBreak: "break-word",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {paragraphs.map((p: string) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Popover.Dropdown>
    </Popover>
  );
}
