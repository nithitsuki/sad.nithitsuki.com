import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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

export function SettingsPopup() {
    const { isDemoMode, settings, actions } = useSubjects();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="icon" className="ml-4 mb-0">
                    <FiSettings />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2 mx-4 mt-0 mb-0">
                    <Label htmlFor="abbr">Abbreviate:</Label>
                    <Switch id="abbr" checked={settings.abbreviateNames} onCheckedChange={actions.toggleAbbreviation} />
                </div>
                
                <div className="mx-4 mt-4 mb-0">
                    <Link href="/">
                        <Button variant="outline" className="w-full">
                            ← Home
                        </Button>
                    </Link>
                </div>

                {!isDemoMode && (
                    <div className="mx-4 mt-2 mb-0">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full" variant="outline">
                                    Add a Subject
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Undergoing Bug Fixes</DialogTitle>
                                    <DialogDescription>
                                        This core feature will be implemented soon™
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

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
