"use client";
import { useState } from "react";
import { formSchema, formSchemaType } from "@/schemas/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImSpinner2 } from "react-icons/im";
import { Button } from "./ui/button";

import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

import { BsFileEarmarkPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { FileUpload } from "./ui/fileupload";
import { DateInput } from "./ui/dateinput";;
import { useUser } from "@clerk/nextjs";
import { database, storage } from '../components/firebase/firebaseConfig'
function CreateFormBtn() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [progresscircle, setProgress] = useState<number>();
  const router = useRouter();
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
  });
  const handleOpenDialog = () => {
    setIsOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setIsOpen(false); // Close the dialog
  };

  const [show, setShow] = useState(false)
  const handleChange = (selectedDate: Date) => {
    console.log(selectedDate)
  }
  const handleClose = (state: boolean) => {
    setShow(state)
  }
  async function saveFiles(files: File[], school: string, date: string, fileType: string, setProgress: (progress: number) => void) {
    try {
      const totalBytes = files.reduce((total, file) => total + file.size, 0);
      let bytesUploaded = 0;

      const promises = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          let storagePath;
          if (file.type.includes('image')) {
            storagePath = `uploads/${school}/${date}/images/${file.name}`;
          } else if (file.type.includes('video')) {
            storagePath = `uploads/${school}/${date}/videos/${file.name}`;
          } else {
            // Handle other file types or throw an error
            reject(new Error('Unsupported file type'));
            return;
          }
          const storageRef = storage.ref(storagePath);
          const uploadTask = storageRef.put(file);

          // Track upload progress
          uploadTask.on('state_changed',
            (snapshot) => {
              // Update bytesUploaded
              bytesUploaded += snapshot.bytesTransferred;

              // Calculate cumulative progress
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              setProgress(progress); // Update progress state
            },
            (error) => {
              // Handle unsuccessful uploads
              reject(error);
            },
            () => {
              // Handle successful uploads on complete
              console.log('Upload completed');
              resolve(storageRef.getDownloadURL());
            }
          );
        });
      });

      const uploadResults = await Promise.all(promises);
      return uploadResults; // Return array of URLs
    } catch (error) {
      throw new Error("Failed to upload files: " + error?.toString());
    }
  }

  async function onSubmit(values: formSchemaType) {
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const name = user?.firstName;
      const { school, dateVisit, ...formData } = values;
      const schoolRef = database.ref(`submissions/${school}`);

      // Remove invalid characters from the email address
      const sanitizedUserEmail = userEmail?.replace(/[.#$/[\]]/g, "");
      if (!sanitizedUserEmail) {
        throw new Error("User email is invalid");
      }
      const userRef = database.ref(`users/${sanitizedUserEmail}`);
      console.log(user);
      const snapshot = await userRef.once('value');
      let submissionCount = snapshot.val()?.submission || 0;

      // Update the submission count
      submissionCount++;
      formData.name = name?.toString()
      // Save the updated submission count back to the database
      await userRef.update({ submission: submissionCount });

      // Format date range as "DateFrom_to_DateTo"
      const DateVisit = dateVisit.toISOString().split('T')[0]; // Extract only the date part

      // Format date range as "DateFrom_to_DateTo"
      const dateRange = `${DateVisit}`;

      const submissionRef = schoolRef.child(dateRange);

      // Fetch existing data from the database
      const existingDataSnapshot = await submissionRef.once('value');
      const existingData = existingDataSnapshot.val();

      let newIndex = 0;
      if (existingData) {
        // If data already exists, find the next available index
        const lastIndex = Object.keys(existingData).reduce((maxIndex, key) => {
          const index = parseInt(key);
          return index > maxIndex ? index : maxIndex;
        }, 0);
        newIndex = lastIndex + 1;
      }
      if (!values.images) {
        formData.images = []
      }
      if (!values.videos) {
        formData.videos = []
      }
      if (!values.feedback) {
        formData.feedback = ''
      }
      if (!values.weeksPortionsCovered) {
        formData.weeksPortionsCovered = ''
      }
      // Save the new form data under the next available index
      await submissionRef.child(newIndex.toString()).set(formData);

      if (values.images) {
        const imageUrls = await saveFiles(values.images, school, dateRange, 'images', setProgress);
        await submissionRef.child(newIndex.toString()).child('images').set(imageUrls);
      }

      if (values.videos) {
        const videoUrls = await saveFiles(values.videos, school, dateRange, 'videos', setProgress);
        await submissionRef.child(newIndex.toString()).child('videos').set(videoUrls);
      }
      // Show success message or navigate to another page
      toast({
        title: "Success",
        description: "Form created successfully",
        variant: "default"
      });
      handleCloseDialog();
    } catch (error) {
      // Handle errors
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
      console.error("Error saving submission:", error);
    }
  }

  return (
    <Dialog open={isOpen}  >
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          onClick={handleOpenDialog}
          className="group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
        >
          <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">Create new submission</p>
        </Button>
      </DialogTrigger>
      <DialogContent >

        <div onClick={handleCloseDialog} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">

          <Cross2Icon className="h-4 w-4" />
          <span className="sr-only">Close</span>

        </div>
        <DialogHeader>
          <DialogTitle>Submission Data</DialogTitle>
          <DialogDescription>Create a new submission to start collecting responses</DialogDescription>
        </DialogHeader>
        <div className="overflow-auto max-h-[calc(100vh-200px)]">
          <Form {...form} > {/* Center and limit width on small screens */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <select
                          {...field}
                          className="block appearance-none w-full bg-transparent border border-gray-150 text-gray-700 py-3 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:ring-opacity-100"
                        >
                          <option value="">Select a school</option>
                          <option value="Subhadra International School">Subhadra International School</option>
                          <option value="Annasaheb Dange International School">Annasaheb Dange International School</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4"> <FormField
                control={form.control}
                name="dateVisit"
                render={({ field }) => (
                  <FormItem>

                    <FormControl>
                      <FormItem>
                        <FormLabel>Date Visit</FormLabel>
                        <FormControl>
                          <DateInput
                            {...field}
                            value={field.value ? field.value.toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              </div>

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUpload
                        {...field}
                        multiple  // Allow multiple file selection
                        accept="image/*"  // Accept only image files
                        onChange={(e) => {
                          const selectedFiles = e.target.files;
                          const filteredFiles = Array.from(selectedFiles!!).filter(file => file.type.includes('image'));
                          field.onChange(filteredFiles);
                        }}
                        value={undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Videos</FormLabel>
                    <FormControl>
                      <FileUpload
                        {...field}
                        multiple  // Allow multiple file selection
                        accept="video/*"  // Accept only video files
                        onChange={(e) => {
                          const selectedFiles = e.target.files;
                          const filteredFiles = Array.from(selectedFiles!!).filter(file => file.type.includes('video'));
                          field.onChange(filteredFiles);
                        }}
                        value={undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />



              <FormField
                control={form.control}
                name="weeksPortionsCovered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portion covered in that week</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField control={form.control} name="feedback" render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />



            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            loading={form.formState.isSubmitting} // Pass loading prop to indicate form submission state
            progress={progresscircle} // Pass progress state to show upload progress
            className="w-full mt-4"
          >
            {!form.formState.isSubmitting && <span>Save</span>}
            {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateFormBtn;
