"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"

interface InputAreaProps {
    onCancel: () => void;
}

export default function InputArea({ onCancel }: InputAreaProps) {

    const formSchema = z.object({
        subjectName: z.string().min(2).max(50),
        No_ClassesPerWeek: z.coerce.number({
          invalid_type_error: "Required",
          required_error: "Required"
        }).int().min(1).max(6),
        ClassesOccurred: z.coerce.number({
          invalid_type_error: "Required",
          required_error: "Required"
        }).int().min(1).max(99),
        ClassesAttended: z.coerce.number({
          invalid_type_error: "Required", 
          required_error: "Required"
        }).int().min(1).max(99),
        MinAttendancePercentage: z.number().int().min(0).max(100),
      }).refine(
        (data) => data.ClassesAttended <= data.ClassesOccurred,
        {
          message: "Cannot exceed classes occurred",
          path: ["ClassesAttended"]
        }
      );
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),defaultValues: {
            MinAttendancePercentage: 75, // Set the actual default value
        },
    })


    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        try {
            // Retrieve existing data from localStorage
            
            const existingData = localStorage.getItem('subjectsData');
            let subjectsArray = [];

            if (existingData) {
            try {
                subjectsArray = JSON.parse(existingData);
                // Ensure it's an array
                if (!Array.isArray(subjectsArray)) {
                console.error("Existing data in localStorage is not an array. Resetting.");
                subjectsArray = [];
                }
            } catch (error) {
                console.error("Error parsing existing data from localStorage:", error);
                // If parsing fails, reset to an empty array
                subjectsArray = [];
            }
            }

            // Add the new subject data to the array
            subjectsArray.push(values);

            // Save the updated array back to localStorage
            localStorage.setItem('subjectsData', JSON.stringify(subjectsArray));
            console.log("Data saved to localStorage:", subjectsArray);
            // Optionally, reset the form or call onCancel after successful submission
            form.reset(); // Reset form fields
            if (onCancel) {
            onCancel(); // Call the cancel handler (e.g., to close a modal)
            }

        } catch (error) {
            console.error("Error saving data to localStorage:", error);
            // Handle potential storage errors (e.g., storage full)
        }
    }

    return (
        <Card className="mx-auto max-w-[600px]">
            <CardHeader>
                <CardTitle>Add a new subject</CardTitle>
                <CardDescription>
                    Fill in the details below to add a new subject to your schedule. Ensure the information is accurate, as it will be used for predicting attendance percantages.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <FormField
                            control={form.control}
                            name="subjectName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject Name: </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Subject Name" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                
                            )}
                        />
                        
                        <div className="flex flex-wrap gap-4 items-start justify-center mt-5">
                        <FormField
                            control={form.control}
                            name="No_ClassesPerWeek"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>No Classes Per Week: </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value ? String(field.value) : undefined}>
                                        <SelectTrigger className="w-[155px]">
                                            <SelectValue placeholder="classes per week" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1</SelectItem>
                                            <SelectItem value="2">2</SelectItem>
                                            <SelectItem value="3">3</SelectItem>
                                            <SelectItem value="4">4</SelectItem>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="6">6</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="ClassesOccurred"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Classes Occurred: </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="No. Occurred"
                                            className="w-[120px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="ClassesAttended"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Classes Attended: </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="No. Attended"
                                            className="w-[120px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />    
                        <FormField
                            control={form.control}
                            name="MinAttendancePercentage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min Attendance %: </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Min Attendance %"
                                            className="w-[120px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            {...field}
                                            value={field.value || 75}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />    

                        </div>
                        <div className="flex flex-wrap gap-4 items-start justify-center mt-5">
                        <Button type="submit" className="mt-3 item-center">Add Subject</Button>
                        <Button onClick={onCancel} className="mt-3 item-center">Cancel</Button>
                        </div>

                    </form>
                    
                </Form>
            </CardContent>
        </Card>
    );
}
