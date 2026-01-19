import { Outlet } from "react-router-dom";
import { Layout } from "@/components/Layout";

export default function ManagerLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
