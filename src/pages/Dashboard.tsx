import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CreateVersionModal } from "./CreateVersionModal";
import { EditVersionModal } from "./EditVersionModal";

interface Version {
  _id: string;
  version: string;
  changelog: string;
  downloadLink: string;
  createdAt: string;
  appName: string;
}

const Dashboard = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/versions`
      );
      if (response.ok) {
        const data = await response.json();
        setVersions(data);
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Deploy Apps</h1>
        <div className="space-x-2">
          <CreateVersionModal token={token} onVersionCreated={fetchVersions} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Version List</CardTitle>
          <CardDescription>
            All available versions of the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>App Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Changelog</TableHead>
                <TableHead>Download Link</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.map((version) => (
                <TableRow key={version._id}>
                  <TableCell>{version.appName}</TableCell>
                  <TableCell>{version.version}</TableCell>
                  <TableCell>{version.changelog}</TableCell>
                  <TableCell>
                    <a
                      href={version.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Download
                    </a>
                  </TableCell>
                  <TableCell>
                    {new Date(version.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <EditVersionModal
                      version={version}
                      token={token}
                      onVersionUpdated={fetchVersions}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
