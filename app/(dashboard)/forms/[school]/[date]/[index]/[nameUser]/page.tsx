'use client'
import FormLinkShare from "@/components/FormLinkShare";

import React, { useState, useEffect } from "react";
import { Carousel } from 'react-responsive-carousel';
import { database, storage } from '@/components/firebase/firebaseConfig'
import { Button } from "@/components/ui/buttoncopy";
import { Button as Yo } from "@/components/ui/button";
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { toast } from "@/components/ui/use-toast";
import IconButton from '@mui/material/IconButton';

import DeleteIcon from '@mui/icons-material/Delete';

function FormDetailPage({
  params,
}: {
  params: {
    school: string,
    date: string,
    index: string,
    nameUser: string
  };
}) {
  const { school, date, index, nameUser } = params;
  const schoolwithoutspace = decodeURIComponent(school);
  const submissionRef = database.ref(`submissions/${schoolwithoutspace}/${date}/${index}`);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [wpc, setWPC] = useState<string>('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [imagesFor, setImages] = useState<string[] | never[]>([]);
  const [videosFor, setVideo] = useState<string[] | never[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [newfeedback, setNewFeedback] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingv, setLoadingV] = useState(false);
  useEffect(() => {
    const fetchSubmissionData = () => {
      submissionRef.once('value')
        .then(snapshot => {
          const submissionData = snapshot.val();
          const feedbacksuck = submissionData?.feedback;
          if (submissionData) {
            setImages(submissionData.images);
            setWPC(submissionData.weeksPortionsCovered);
            setFeedback(submissionData.feedback);
            setVideo(submissionData.videos);
            console.log(submissionData);
            console.log(school + 'hi');
            console.log('hi');

            if (!school || !date || !index) {
              throw new Error("submission form not found");
            }
          }
        })
        .catch(error => {
          console.error('Error fetching submission data:', error);
        });
    };

    fetchSubmissionData();
  }, [nameUser]);

  // Fetch submission data

  // Remove image from images array

  // Check if submission exists and name matches
  if (!school) {
    throw new Error('Submission not found or name does not match');
  }



  const handleDeleteImage = (index: number) => {
    const updatedImages = [...imagesFor];
    updatedImages.splice(index, 1);
    submissionRef.update({ images: updatedImages })
      .then(() => {
        setImages(updatedImages);
      })
      .catch((error) => {
        console.error('Error deleting image:', error);
      });
  };
  const handleDeleteVideo = (index: number) => {
    const updatedImages = [...videosFor];
    updatedImages.splice(index, 1);
    submissionRef.update({ videos: updatedImages })
      .then(() => {
        setVideo(updatedImages);
      })
      .catch((error) => {
        console.error('Error deleting image:', error);
      });
  };
  const handleSubmit = () => {
    const updatedImages = [...imagesFor];

    submissionRef.update({ images: updatedImages, videos: videosFor, feedback: feedback, weeksPortionsCovered: wpc })
      .then(() => {
        setImages(updatedImages);
        toast({
          title: "Success",
          description: "Form updated successfully",
          variant: "default"
        });

      })
      .catch((error) => {
        console.error('Error deleting image:', error);
      });
  };

  const handleFileInputChange = (selectedFiles: FileList | null, fileType: 'image' | 'video') => {
    if (!selectedFiles) return;

    const promises: Array<Promise<string>> = [];
    const progressKey = fileType === 'image' ? 'imageProgress' : 'videoProgress';

    // Upload each selected file to Firebase Storage
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      let storagePath = '';

      if (fileType === 'image') {
        storagePath = `uploads/images/${file.name}`;
        setLoading(true)
      } else if (fileType === 'video') {
        storagePath = `uploads/videos/${file.name}`;
        setLoadingV(true)
      }

      const storageRef = storage.ref(storagePath);
      const uploadTask = storageRef.put(file);

      // Track upload progress
      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      });

      // Get the download URL after the upload is complete
      const promise = uploadTask.then((snapshot) => snapshot.ref.getDownloadURL());
      promises.push(promise);
    }

    // After all uploads are complete, update state with the download URLs
    Promise.all(promises)
      .then((fileURLs) => {
        if (fileType === 'image') {
          setImages((prevFiles) => (prevFiles ? [...prevFiles, ...fileURLs] : [...fileURLs]));
        } else if (fileType === 'video') {
          setVideo((prevFiles) => (prevFiles ? [...prevFiles, ...fileURLs] : [...fileURLs]));
          setLoadingV(false)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error uploading files:', error);
      });
  };
  function handleInputChangeFeedback(value: string) {
    setFeedback(value)
  }
  function handleInputChangeWPS(value: string) {
    setWPC(value)
    console.log(value)
  }
  return (
    <>
      <div className="py-10 border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{nameUser}</h1>
        </div>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={feedback} pronoun="Feedback" onInputChange={handleInputChangeFeedback} />
        </div>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={wpc} pronoun="Portion Covered" onInputChange={handleInputChangeWPS} />
        </div>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="flex justify-center container">
          <div className="items-center justify-center display-flex" style={{ margin: '8px' }}>
            <Button fileType="image" onFileInputChange={(files) => handleFileInputChange(files, 'image')} progress={progress} loading={loading}>
              Upload Images
            </Button>
          </div>
        </div>
        <div className="container flex gap-2 items-center justify-center">
          {/* Display images carousel */}
          <Carousel showThumbs={true} width={500}>
            {imagesFor?.map((imageUrl, index) => (
              <div key={index} style={{ margin: '0 10px', position: 'relative' }}>
                <img
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  style={{ maxWidth: '500px', maxHeight: '500px', borderRadius: '10px' }}
                />
                <IconButton onClick={() => handleDeleteImage(index)} aria-label="delete" size="medium">
                  <DeleteIcon fontSize="inherit" />
                </IconButton>

                <div style={{ position: 'relative', margin: '8px', bottom: '0px', left: '0', width: '100%', display: 'flex', justifyContent: 'space-between' }}>


                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
      <div className="flex justify-center container">
        <div className="items-center justify-center display-flex" style={{ margin: '8px' }}>
          <Button fileType="video" onFileInputChange={(files) => handleFileInputChange(files, 'video')} progress={progress} loading={loadingv}>
            Upload Video
          </Button>
        </div>
      </div>
      <div className="container flex gap-2 items-center justify-center">
        {/* Display videos carousel */}
        <Carousel showThumbs={true} width={500}>
          {videosFor?.map((videoUrl, index) => (
            <div key={index} style={{ margin: '0 10px', position: 'relative' }}>
              <video key={index} controls style={{ maxWidth: '500px', maxHeight: '500px', borderRadius: '10px' }}>
                <source src={videoUrl} type="video/mp4" />
              </video>
              <IconButton onClick={() => handleDeleteVideo(index)} aria-label="delete" size="medium">
                <DeleteIcon fontSize="inherit" />
              </IconButton>

              <div style={{ position: 'relative', margin: '8px', bottom: '0px', left: '0', width: '100%', display: 'flex', justifyContent: 'space-between' }}>


              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <div className="flex justify-center container">
        <div className="items-center justify-center display-flex" style={{ margin: '8px' }}>
          <div style={{ textAlign: 'center', width: '100%', fontSize: '1.5rem' }}>
            <Yo onClick={handleSubmit}>Save</Yo>
          </div>
        </div>
      </div>
    </>

  );
}

export default FormDetailPage;

