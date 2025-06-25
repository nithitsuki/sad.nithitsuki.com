import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useId, useState } from "react"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"


interface InfoPopupProps {
    Course: string;
    MinAttendancePercentage: number;
    localTotal: number;
    localPresent: number;
    localAbsent: number;
    SkippableClasses: number;
    AttendancePercentageRounded: number;
    borderColor: string;
    Notes: string;
    daysOfWeek: string[];
}

function InfoPopup(props: InfoPopupProps) {
    const id = useId()

    const DaysOfWeek = [
        { value: "1", label: "Monday", defaultChecked: props.daysOfWeek?.includes('1'), disabled: true },
        { value: "2", label: "Tuesday", defaultChecked: props.daysOfWeek?.includes('2'), disabled: true },
        { value: "3", label: "Wednesday", defaultChecked: props.daysOfWeek?.includes('3'), disabled: true },
        { value: "4", label: "Thursday", defaultChecked: props.daysOfWeek?.includes('4'),  disabled: true },
        { value: "5", label: "Friday", defaultChecked: props.daysOfWeek?.includes('5'),    disabled: true },
        { value: "6", label: "Saturday", defaultChecked: props.daysOfWeek?.includes('6'),  disabled: true },
        { value: "7", label: "Sunday", defaultChecked: props.daysOfWeek?.includes('7'),    disabled: true },
    ]
    
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <p className="dark:text-green-400 text-center cursor-pointer">Info</p>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-[640px] sm:max-w-[425px] md:max-w-[500px] lg:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">{props.Course}</DialogTitle>
                        <DialogDescription>
                            Detailed attendance information and statistics
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid w-full gap-1">
                        <Label htmlFor="message">Notes:</Label>
                        <span id="notes" className="text-muted-foreground">{props.Notes ? props.Notes : `You dont have any notes,\n use the edit popup to add some.`}</span>
                    </div>
                    <div className="">
                        <div className="space-y-2">

                            <div className="grid grid-cols-3 gap-2 text-left pb-4">
                                <div>
                                    <span className="text-xs text-muted-foreground">Present:</span>
                                    <div className="font-medium">{props.localPresent}</div>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground">Absent:</span>
                                    <div className="font-medium">{props.localAbsent}</div>
                                </div>
                                <div className="border-l pl-2">
                                    <span className="text-xs text-muted-foreground">Total:</span>
                                    <div className="font-medium">{props.localTotal}</div>
                                </div>
                            </div>

                            <div className="flex justify-left">
                                <span className="text-sm text-muted-foreground">Required:&nbsp;&nbsp;</span>
                                <span className="font-medium">{props.MinAttendancePercentage}%</span>
                            </div>
                            

                                <fieldset className="space-y-4">
                                    <legend className="text-foreground text-sm leading-none font-medium">
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>Classes per week:&nbsp;&nbsp;</span>
                                            <span className="font-medium text-foreground"> {props.daysOfWeek.length}</span>
                                        </div>
                                    </legend>
                                    <legend className="text-foreground text-sm leading-none font-medium">
                                        <div className="flex justify-left text-sm text-muted-foreground">
                                            <span>Today is:&nbsp;&nbsp;</span>
                                            <span className="font-medium text-foreground"> {new Date().toUTCString().split(' ').slice(0, 3).join(' ')}</span>
                                        </div>
                                    </legend>
                                    
                                    <div className="flex gap-1.5">
                                        {DaysOfWeek.map((day) => (
                                            <label
                                                key={`${id}-${day.value}`}
                                                className="border-input has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary has-data-[state=checked]:text-primary-foreground has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 cursor-pointer flex-col DaysOfWeek-center justify-center gap-3 rounded-full border text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
                                            >
                                                <Checkbox
                                                    id={`${id}-${day.value}`}
                                                    value={day.value}
                                                    className="sr-only after:absolute after:inset-0"
                                                    defaultChecked={day.defaultChecked}
                                                    disabled={day.disabled}
                                                />
                                                <span aria-hidden="true" className="text-sm font-medium">
                                                    {day.label[0]}
                                                </span>
                                                <span className="sr-only">{day.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                                
                            {props.AttendancePercentageRounded >= props.MinAttendancePercentage ?
                                (<div className="flex justify-between dark:text-green-400" style={{ color: props.borderColor }}>
                                    <span className="text-sm">Can skip:</span>
                                    <span className="font-medium">{props.SkippableClasses} classes</span>
                                </div>) : (<div className="flex justify-between text-red-600 dark:text-red-400">
                                    <span className="text-sm">Must attend:</span>
                                    <span className="font-medium">
                                        {Math.ceil((props.MinAttendancePercentage * props.localTotal - 100 * props.localPresent) / (100 - props.MinAttendancePercentage))} more classes
                                    </span>
                                </div>)
                            }
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default InfoPopup;