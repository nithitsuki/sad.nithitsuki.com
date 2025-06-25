import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useId, useState } from "react"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "../ui/input";

interface EditPopupProps {
    Sl_No: string;
    Course: string;
    CourseAbbreviation: string;
    MinAttendancePercentage: number;
    localTotal: number;
    localPresent: number;
    localAbsent: number;
    SkippableClasses: number;
    AttendancePercentageRounded: number;
    borderColor: string;
}

function EditPopup(props: EditPopupProps) {
    const id = useId()
    const [open, setOpen] = useState(false)
    const [present, setPresent] = useState(props.localPresent)
    const [absent, setAbsent] = useState(props.localAbsent)
    const [minAttendance, setMinAttendance] = useState(props.MinAttendancePercentage)

    const total = present + absent
    const currentAttendancePercentage = total > 0 ? Math.round((present / total) * 100) : 0
    const skippableClasses = currentAttendancePercentage >= minAttendance 
        ? Math.floor((100 * present - minAttendance * total) / minAttendance)
        : 0

    const subjectInfo = JSON.parse(localStorage.getItem('subjectsData') || '[]').find((s: any) => s.Sl_No === props.Sl_No);
    const Notes = subjectInfo?.Notes ?? "";
    const savedDays = subjectInfo?.daysOfWeek ?? [];

    const DaysOfWeek = [
        { value: "1", label: "Monday", defaultChecked: savedDays.includes('1'), disabled: false },
        { value: "2", label: "Tuesday", defaultChecked: savedDays.includes('2'), disabled: false },
        { value: "3", label: "Wednesday", defaultChecked: savedDays.includes('3'), disabled: false },
        { value: "4", label: "Thursday", defaultChecked: savedDays.includes('4'), disabled: false },
        { value: "5", label: "Friday", defaultChecked: savedDays.includes('5'), disabled: false },
        { value: "6", label: "Saturday", defaultChecked: savedDays.includes('6'), disabled: false },
        { value: "7", label: "Sunday", defaultChecked: savedDays.includes('7'), disabled: false },
    ]
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const subjectsDataString = localStorage.getItem('subjectsData');
        if (!subjectsDataString) return;

        const subjectsData = JSON.parse(subjectsDataString);
        
        const form = e.currentTarget;
        const nicknameInput = form.elements.namedItem(id) as HTMLInputElement;
        const notesInput = form.elements.namedItem('message') as HTMLTextAreaElement;
        const selectedDays = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => (checkbox as HTMLInputElement).value);
        const updatedSubjects = subjectsData.map((subject: any) => {
            if (subject.Sl_No === props.Sl_No) {
                const newTotal = present + absent;
                const newPercentage = newTotal > 0 ? parseFloat(((present / newTotal) * 100).toFixed(2)) : 0;
                return {
                    ...subject,
                    CourseAbbreviation: nicknameInput.value || props.CourseAbbreviation,
                    Notes: notesInput.value,
                    present,
                    absent,
                    total: newTotal,
                    MinAttendancePercentage: minAttendance,
                    percentage: newPercentage,
                    daysOfWeek: selectedDays,
                };
            }
            return subject;
        });

        localStorage.setItem('subjectsData', JSON.stringify(updatedSubjects));
        setOpen(false);
        window.location.reload();
    };

    const handleDiscard = () => {
        setOpen(false)
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <p className="dark:text-sky-400 text-center cursor-pointer">Edit</p>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-[640px] sm:max-w-[425px] md:max-w-[500px] lg:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">{props.Course}</DialogTitle>
                        <DialogDescription>
                            Edit attendance details and notes for this subject.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor={id}>Change Subject Nickname</Label>
                            <Input id={id} placeholder={props.CourseAbbreviation} defaultValue={props.CourseAbbreviation} />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="message">Note:</Label>
                            <Textarea placeholder={`Add any notes here, example:\nThis teacher arrives late on wednesdays`} id="message" defaultValue={Notes}/>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-2 text-left">
                                    <div>
                                        <Label htmlFor="present" className="text-xs text-muted-foreground">Present:</Label>
                                        <Input
                                            id="present"
                                            type="number"
                                            min="0"
                                            value={present}
                                            onChange={(e) => setPresent(Number(e.target.value))}
                                            className="h-8"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="absent" className="text-xs text-muted-foreground">Absent:</Label>
                                        <Input
                                            id="absent"
                                            type="number"
                                            min="0"
                                            value={absent}
                                            onChange={(e) => setAbsent(Number(e.target.value))}
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="border-l pl-2">
                                        <span className="text-xs text-muted-foreground">Total:</span>
                                        <div className="font-medium h-8 flex DaysOfWeek-center">{total}</div>
                                    </div>
                                </div>
                                <div className="flex justify-between DaysOfWeek-center">
                                    <Label htmlFor="minAttendance" className="text-sm text-muted-foreground">Minimum Percentage:</Label>
                                    <div className="flex DaysOfWeek-center gap-1">
                                        <Input
                                            id="minAttendance"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={minAttendance}
                                            onChange={(e) => setMinAttendance(Number(e.target.value))}
                                            className="h-8 w-16"
                                        />
                                        <span className="font-medium">%</span>
                                    </div>
                                </div>

                                <fieldset className="space-y-4">
                                    <legend className="text-foreground text-sm leading-none font-medium">
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>Classes per week:&nbsp;&nbsp;</span>
                                            <span className="font-medium text-foreground"> {savedDays.length}</span>
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
                                                />
                                                <span aria-hidden="true" className="text-sm font-medium">
                                                    {day.label[0]}
                                                </span>
                                                <span className="sr-only">{day.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                                
                                {currentAttendancePercentage >= minAttendance ?
                                    (<div className="flex justify-between text-green-600 dark:text-green-400">
                                        <span className="text-sm">Can skip:</span>
                                        <span className="font-medium">{skippableClasses} classes</span>
                                    </div>) : (<div className="flex justify-between text-red-600 dark:text-red-400">
                                        <span className="text-sm">Must attend:</span>
                                        <span className="font-medium">
                                            {Math.ceil((minAttendance * total - 100 * present) / (100 - minAttendance))} more classes
                                        </span>
                                    </div>)
                                }
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={handleDiscard}>
                                Discard
                            </Button>
                            <Button type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default EditPopup;