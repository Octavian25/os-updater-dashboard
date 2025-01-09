import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CreateVersionModalProps {
  token: string | null;
  onVersionCreated: () => void;
}

export function CreateVersionModal({
  token,
  onVersionCreated,
}: CreateVersionModalProps) {
  const [open, setOpen] = useState(false);
  const [newVersion, setNewVersion] = useState({
    version: "",
    changelog: "",
    downloadLink: "",
    appName: "",
  });
  const { toast } = useToast();

  const handleCreateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/versions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newVersion),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Version created successfully.",
        });
        onVersionCreated();
        setNewVersion({
          version: "",
          changelog: "",
          downloadLink: "",
          appName: "",
        });
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Version</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Version</DialogTitle>
          <DialogDescription>
            Add a new version to the system. Fill out the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateVersion}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="version"
                placeholder="App Name"
                className="col-span-4"
                value={newVersion.appName}
                onChange={(e) =>
                  setNewVersion({ ...newVersion, appName: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="version"
                placeholder="Version"
                className="col-span-4"
                value={newVersion.version}
                onChange={(e) =>
                  setNewVersion({ ...newVersion, version: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="changelog"
                placeholder="Changelog"
                className="col-span-4"
                value={newVersion.changelog}
                onChange={(e) =>
                  setNewVersion({ ...newVersion, changelog: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="downloadLink"
                placeholder="Download Link"
                className="col-span-4"
                value={newVersion.downloadLink}
                onChange={(e) =>
                  setNewVersion({ ...newVersion, downloadLink: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Version</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
