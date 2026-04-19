import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FiSettings } from "react-icons/fi";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSubjects } from "@/contexts/SubjectContext";

interface SettingsPopupProps {
    onOpenYar?: () => void;
}

export function SettingsPopup({ onOpenYar }: SettingsPopupProps) {
    const { isDemoMode, settings, actions } = useSubjects();
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" className="ml-4 mb-0">
                    <FiSettings />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2 mx-4 mt-0 mb-4">
                    <Label htmlFor="abbr">Abbreviate Names:</Label>
                    <Switch id="abbr" checked={settings.abbreviateNames} onCheckedChange={actions.toggleAbbreviation} />
                </div>

                <div className="flex items-center space-x-2 mx-4 mt-0 mb-4">
                    <Label htmlFor="od-perc">Show OD Percentage:</Label>
                    <Switch id="od-perc" checked={settings.showODPercentage} onCheckedChange={actions.setShowODPercentage} />
                </div>

                <div className="mx-4 mt-0 mb-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            onOpenYar?.();
                            setOpen(false);
                        }}
                    >
                        Open Your Attendance Rewind (YAR!)
                    </Button>
                </div>
                
                <div className="mx-4 mt-4 mb-0">
                    <Link href="/">
                        <Button variant="outline" className="w-full">
                            ← Home
                        </Button>
                    </Link>
                </div>

                {!isDemoMode && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="bg-red-400 mt-0 mb-4 sm:mb-0 hover:bg-red-500 w-full">
                                Clear All Subjects
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    current subjects and their attendance data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-400 mt-0 mb-4 sm:mb-0 hover:bg-red-500"
                                    onClick={() => actions.deleteAllSubjects()}
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </DialogContent>
        </Dialog>
    );
}
