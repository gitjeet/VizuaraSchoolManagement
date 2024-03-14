import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function FormLinkShare({ shareUrl, pronoun, onInputChange }: { shareUrl: string, pronoun: string, onInputChange: (value: string) => void }) {
  const [mounted, setMounted] = useState(false);
  const [internalShareUrl, setInternalShareUrl] = useState(shareUrl);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setInternalShareUrl(shareUrl);
  }, [shareUrl]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInternalShareUrl(newValue);
    onInputChange(newValue); // Notify parent component of input change
  };

  if (!mounted) {
    return null; // avoiding window not defined error
  }

  const handleButtonClick = () => {
    // Logic to handle button click
    console.log("Button clicked");
  };

  return (
    <div className="flex flex-grow gap-4 items-center">
      <Button
        className="w-[250px]"
        onClick={handleButtonClick}
      >
        {pronoun}
      </Button>
      <Input value={internalShareUrl} onChange={handleInputChange} />
    </div>
  );
}

export default FormLinkShare;
