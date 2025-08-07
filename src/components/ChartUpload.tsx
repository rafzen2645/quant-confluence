import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartUploadProps {
  onImageUpload: (file: File) => void;
  isAnalyzing: boolean;
}

export const ChartUpload = ({ onImageUpload, isAnalyzing }: ChartUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-trading">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-primary" />
          Chart Analysis
        </h2>
        
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
            isDragOver ? "border-primary bg-primary/5" : "border-border",
            isAnalyzing && "opacity-50 pointer-events-none"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadedImage ? (
            <div className="space-y-4">
              <img 
                src={uploadedImage} 
                alt="Uploaded chart" 
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
              />
              {!isAnalyzing && (
                <Button
                  variant="outline"
                  onClick={() => setUploadedImage(null)}
                  className="border-primary/30 hover:border-primary"
                >
                  Upload New Chart
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">Upload Chart Screenshot</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag & drop or click to select
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="chart-upload"
                disabled={isAnalyzing}
              />
              <Button
                variant="outline"
                asChild
                className="border-primary/30 hover:border-primary"
                disabled={isAnalyzing}
              >
                <label htmlFor="chart-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-accent/30 rounded-lg border border-accent">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-trading-warning mt-0.5 flex-shrink-0" />
            <div className="text-xs text-accent-foreground">
              <p className="font-medium">Upload Requirements:</p>
              <ul className="mt-1 space-y-1 list-disc list-inside ml-2">
                <li>Clear chart with visible candle structure</li>
                <li>Upload 30 seconds before candle expiry</li>
                <li>Include timeframe and price levels</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};