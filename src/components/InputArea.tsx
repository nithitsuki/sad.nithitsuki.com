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


export default function InputArea() {    

    const formSchema = z.object({
        subjectname: z.string().min(2).max(50),
        classesperweek: z.coerce.number({
          invalid_type_error: "Required",
          required_error: "Required"
        }).int().min(1).max(6),
        classesoccured: z.coerce.number({
          invalid_type_error: "Required",
          required_error: "Required"
        }).int().min(1).max(99),
        classesattended: z.coerce.number({
          invalid_type_error: "Required", 
          required_error: "Required"
        }).int().min(1).max(99)
      }).refine(
        (data) => data.classesattended <= data.classesoccured,
        {
          message: "Cannot exceed classes occurred",
          path: ["classesattended"]
        }
      );
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })


    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
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
                            name="subjectname"
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
                            name="classesperweek"
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
                            name="classesoccured"
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
                            name="classesattended"
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
                        </div>
                        <div className="flex flex-wrap gap-4 items-start justify-center mt-5">
                        <Button type="submit" className="mt-3 item-center">Add Subject</Button>
                        </div>

                    </form>
                    
                </Form>
            </CardContent>
        </Card>
    );
}
