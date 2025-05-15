"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Brain, FileImage, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Markdown from "@/components/markdown"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function BrainTumorPage() {
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
      const analysisResponse = await fetch('/api/analyze/brain-tumor', {
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
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900">Brain Tumor Detection</h1>
        <p className="text-muted-foreground">Upload an MRI scan to detect the presence of brain tumors</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList className="bg-indigo-50">
          <TabsTrigger value="upload" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900">Upload & Analyze</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900">Analysis History</TabsTrigger>
          <TabsTrigger value="info" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900">Information</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="min-h-[400px] transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  <FileImage className="h-5 w-5" />
                  MRI Scan Upload
                </CardTitle>
                <CardDescription>Upload a brain MRI scan image for tumor detection</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4">
                {preview ? (
                  <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-lg border border-indigo-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <Image src={preview || "/placeholder.svg"} alt="MRI Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-indigo-200 bg-indigo-50/50 transition-colors hover:bg-indigo-50">
                    <Brain className="mb-4 h-10 w-10 text-indigo-400" />
                    <p className="mb-2 text-sm font-medium text-indigo-700">Drag and drop an MRI scan</p>
                    <p className="text-xs text-indigo-600/80">PNG, JPG or DICOM up to 10MB</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => document.getElementById("file-upload-tumor")?.click()}
                    className="border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                    Select File
                  </Button>
                  {preview && (
                    <Button variant="outline" onClick={resetAnalysis}
                      className="border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                      Reset
                    </Button>
                  )}
                  <input id="file-upload-tumor" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">{file ? `Selected: ${file.name}` : "No file selected"}</p>
                <Button onClick={handleAnalyze} disabled={!file || isAnalyzing}
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
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

            <Card className="min-h-[400px] transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700">
                  <Brain className="h-5 w-5" />
                  Analysis Results
                </CardTitle>
                <CardDescription>Brain tumor detection results</CardDescription>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <Brain className="h-16 w-16 animate-pulse text-indigo-400" />
                    <p className="text-center font-medium text-indigo-700">Analyzing MRI scan...</p>
                    <Progress value={65} className="w-full max-w-[300px] bg-indigo-100" />
                  </div>
                ) : result ? (
                  <div className="space-y-6">
                    <div className="rounded-lg bg-indigo-50 p-4 border border-indigo-100">
                      <div className="mb-2 text-sm font-medium text-indigo-700">Diagnosis</div>
                      <div className="text-2xl font-bold text-indigo-900">{result.prediction_class}</div>
                      <div className="mt-1 text-sm text-indigo-600">
                        Confidence: {(result.confidence * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium text-indigo-700">Medical Explanation</div>
                      <Markdown markdown={result.analysis} />
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium text-indigo-700">Confidence Score</div>
                      <div className="flex items-center gap-4">
                        <Progress value={result.confidence * 100} className="w-full bg-indigo-100" />
                        <span className="text-sm font-medium text-indigo-700">{(result.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                    <Brain className="h-16 w-16 text-indigo-200" />
                    <p className="font-medium text-indigo-700">Upload and analyze an MRI scan to see results</p>
                    <p className="text-sm text-indigo-600">
                      The analysis will determine if a brain tumor is present with a confidence score
                    </p>
                  </div>
                )}
              </CardContent>
              {/* {result && (
                <CardFooter>
                  <Button variant="outline" className="w-full border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                    Save Results
                  </Button>
                </CardFooter>
              )} */}
            </Card>
            {/* </ScrollArea> */}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>Your previous brain tumor analyses</CardDescription>
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
              <CardTitle>About Brain Tumor Detection</CardTitle>
              <CardDescription>How our AI model detects brain tumors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our brain tumor detection model analyzes MRI scans to identify the presence of tumors in the brain. The
                model has been trained on a diverse dataset of brain MRI scans and can classify results into two
                categories:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>No Tumor:</strong> No evidence of tumor presence in the brain.
                </li>
                <li>
                  <strong>Tumor Present:</strong> Detection of abnormal tissue growth indicative of a tumor.
                </li>
              </ul>

              <p>The model analyzes various features in the MRI scan, including:</p>

              <ul className="list-disc pl-6 space-y-2">
                <li>Abnormal tissue masses</li>
                <li>Changes in brain structure</li>
                <li>Contrast enhancement patterns</li>
                <li>Edema (swelling) around suspicious areas</li>
                <li>Mass effect on surrounding structures</li>
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
