import { Switch } from "@mui/material";

function Toggle({ checked, onChange, icon = null,label }) {
  return (
    <div className="toggle-container flex align-center">
      <div>{icon}</div>
      {label}
      <Switch
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}

export default Toggle;