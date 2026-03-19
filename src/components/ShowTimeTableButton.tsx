import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

export function ShowTimeTableButton({}) {
  return (
    <div className="mt-2 mb-2 flex flex-wrap justify-center">
        <Dialog>
            <DialogTrigger asChild>
                <Button className="m-0 sm:mb-0">
                    View Timetable
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>View Timetable</DialogTitle>
                    <DialogDescription>
                        You can view your timetable over at our dedicated site. Would you like to go there?
                    </DialogDescription>
                </DialogHeader>
                <div className="text-sm text-muted-foreground mt-2">
                    <p>
                        Supporting a native display of the timetable directly in this app is possible if you are interested in contributing to the project!
                    </p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <a href="https://timetable.nithitsuki.com/" target="_blank" rel="noreferrer">
                        <Button>
                            Go to Timetable Site
                        </Button>
                    </a>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}
  