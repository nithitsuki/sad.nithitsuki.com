import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

export function ShowTimeTableButton({}) {
  return <div className="mt-2 mb-2 flex flex-wrap justify-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className=" m-0 sm:mb-0">
                                    View Timetable
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>View Timetable</DialogTitle>
                                    <DialogDescription>
                                        You'll be able to upload your timetable here in the future. soon™
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>;
}
  