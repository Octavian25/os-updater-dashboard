import { useState, useEffect } from "react";
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

interface Version {
  _id: string;
  version: string;
  changelog: string;
  downloadLink: string;
}

interface EditVersionModalProps {
  version: Version;
  token: string | null;
  onVersionUpdated: () => void;
}

export function EditVersionModal({
  version,
  token,
  onVersionUpdated,
}: EditVersionModalProps) {
  const [open, setOpen] = useState(false);
  const [editedVersion, setEditedVersion] = useState(version);
  const { toast } = useToast();

  useEffect(() => {
    setEditedVersion(version);
  }, [version]);

  const handleEditVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/versions/${version._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedVersion),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Version updated successfully.",
        });
        onVersionUpdated();
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
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Version</DialogTitle>
          <DialogDescription>
            Update the details of this version. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditVersion}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="version"
                placeholder="Version"
                className="col-span-4"
                value={editedVersion.version}
                onChange={(e) =>
                  setEditedVersion({
                    ...editedVersion,
                    version: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="changelog"
                placeholder="Changelog"
                className="col-span-4"
                value={editedVersion.changelog}
                onChange={(e) =>
                  setEditedVersion({
                    ...editedVersion,
                    changelog: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="downloadLink"
                placeholder="Download Link"
                className="col-span-4"
                value={editedVersion.downloadLink}
                onChange={(e) =>
                  setEditedVersion({
                    ...editedVersion,
                    downloadLink: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
