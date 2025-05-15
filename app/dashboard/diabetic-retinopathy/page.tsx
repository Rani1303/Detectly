"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Eye, FileImage, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Markdown from "@/components/markdown"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DiabeticRetinopathyPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
      setResult(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    try {
      // First upload the file to S3
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }

      const { url: imageUrl } = await uploadResponse.json()

      // Then analyze the image
      const analysisResponse = await fetch('/api/analyze/diabetic-retinopathy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl })
      })

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze image')
      }

      const result = await analysisResponse.json()
      setResult(result)
    } catch (error) {
      console.error('Error:', error)
      // You might want to show an error message to the user here
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Diabetic Retinopathy Detection</h1>
        <p className="text-muted-foreground">Upload a retinal image to detect and classify diabetic retinopathy</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
          <TabsTrigger value="history">Analysis History</TabsTrigger>
          <TabsTrigger value="info">Information</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="min-h-[400px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Retinal Image Upload
                </CardTitle>
                <CardDescription>Upload a retinal image for diabetic retinopathy detection</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4">
                {preview ? (
                  <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-lg border">
                    <Image src={preview || "/placeholder.svg"} alt="Retina Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border border-dashed">
                    <Eye className="mb-4 h-10 w-10 text-muted-foreground" />
                    <p className="mb-2 text-sm font-medium">Drag and drop a retinal image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => document.getElementById("file-upload-retina")?.click()}>
                    Select File
                  </Button>
                  {preview && (
                    <Button variant="outline" onClick={resetAnalysis}>
                      Reset
                    </Button>
                  )}
                  <input
                    id="file-upload-retina"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">{file ? `Selected: ${file.name}` : "No file selected"}</p>
                <Button onClick={handleAnalyze} disabled={!file || isAnalyzing} className="gap-2">
                  {isAnalyzing ? (
                    <>Analyzing...</>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            {/* <ScrollArea className="h-[500px]"> */}
            <Card className="min-h-[400px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Analysis Results
                </CardTitle>
                <CardDescription>Diabetic retinopathy detection results</CardDescription>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <Eye className="h-16 w-16 animate-pulse text-primary/70" />
                    <p className="text-center font-medium">Analyzing retinal image...</p>
                    <Progress value={55} className="w-full max-w-[300px]" />
                  </div>
                ) : result ? (
                  <div className="space-y-6">
                    <div className="rounded-lg bg-muted p-4">
                      <div className="mb-2 text-sm font-medium">Diagnosis</div>
                      <div className="text-2xl font-bold text-primary">{result.prediction_class}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Confidence: {(result.confidence * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium">Medical Explanation</div>
                      <Markdown markdown={result.analysis} />
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium">Confidence Score</div>
                      <div className="flex items-center gap-4">
                        <Progress value={result.confidence * 100} className="w-full" />
                        <span className="text-sm font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                    <Eye className="h-16 w-16 text-muted-foreground/50" />
                    <p className="font-medium">Upload and analyze a retinal image to see results</p>
                    <p className="text-sm text-muted-foreground">
                      The analysis will classify diabetic retinopathy severity with detailed explanation
                    </p>
                  </div>
                )}
              </CardContent>
              {result && (
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Save Results
                  </Button>
                </CardFooter>
              )}
            </Card>
            {/* </ScrollArea> */}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>Your previous diabetic retinopathy analyses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No previous analyses found</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Diabetic Retinopathy Detection</CardTitle>
              <CardDescription>How our AI model detects and classifies diabetic retinopathy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our diabetic retinopathy detection model analyzes retinal images to identify and classify the severity
                of diabetic retinopathy. The model has been trained on a large dataset of retinal images and can
                classify results into five categories:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>No Diabetic Retinopathy:</strong> No visible signs of diabetic retinopathy.
                </li>
                <li>
                  <strong>Mild Diabetic Retinopathy:</strong> Presence of microaneurysms only.
                </li>
                <li>
                  <strong>Moderate Diabetic Retinopathy:</strong> More than just microaneurysms but less than severe
                  NPDR.
                </li>
                <li>
                  <strong>Severe Diabetic Retinopathy:</strong> Severe NPDR with significant hemorrhages and other
                  abnormalities.
                </li>
                <li>
                  <strong>Proliferative Diabetic Retinopathy:</strong> Advanced stage with neovascularization or
                  vitreous/preretinal hemorrhage.
                </li>
              </ul>

              <p>The model analyzes various features in the retinal image, including:</p>

              <ul className="list-disc pl-6 space-y-2">
                <li>Microaneurysms (small red dots)</li>
                <li>Hemorrhages (larger red spots)</li>
                <li>Hard exudates (yellow deposits)</li>
                <li>Cotton wool spots (fluffy white patches)</li>
                <li>Neovascularization (abnormal blood vessel growth)</li>
                <li>Venous beading and loops</li>
              </ul>

              <div className="rounded-lg bg-muted p-4 mt-4">
                <p className="text-sm font-medium">Important Note</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This tool is designed to assist medical professionals and should not replace clinical diagnosis.
                  Always consult with a healthcare provider for proper diagnosis and treatment.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
