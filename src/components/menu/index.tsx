import { useEffect, useMemo, useState } from "react";
import { isMobile } from "@/utils/device";
import MenuPc from "./menuPc";
import MenuMobile from "./menuMobile";

export default function Menu() {
  const mobile = isMobile();
  if (mobile) return <MenuMobile />;
  return <MenuPc />;
}
