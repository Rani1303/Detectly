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
export default function AlzheimerPage() {
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
      const analysisResponse = await fetch('/api/analyze/alzheimer', {
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
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-900">Alzheimer's Disease Detection</h1>
        <p className="text-muted-foreground">Upload an MRI scan to detect signs of Alzheimer's disease</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList className="bg-purple-50">
          <TabsTrigger value="upload" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">Upload & Analyze</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">Analysis History</TabsTrigger>
          <TabsTrigger value="info" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">Information</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="min-h-[400px] transition-all duration-300 hover:shadow-lg hover:shadow-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <FileImage className="h-5 w-5" />
                  MRI Scan Upload
                </CardTitle>
                <CardDescription>Upload a brain MRI scan image for analysis</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4">
                {preview ? (
                  <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-lg border border-purple-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <Image src={preview || "/placeholder.svg"} alt="MRI Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-purple-200 bg-purple-50/50 transition-colors hover:bg-purple-50">
                    <Brain className="mb-4 h-10 w-10 text-purple-400" />
                    <p className="mb-2 text-sm font-medium text-purple-700">Drag and drop an MRI scan</p>
                    <p className="text-xs text-purple-600/80">PNG, JPG or DICOM up to 10MB</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}
                    className="border-purple-200 hover:bg-purple-50 hover:text-purple-700">
                    Select File
                  </Button>
                  {preview && (
                    <Button variant="outline" onClick={resetAnalysis}
                      className="border-purple-200 hover:bg-purple-50 hover:text-purple-700">
                      Reset
                    </Button>
                  )}
                  <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">{file ? `Selected: ${file.name}` : "No file selected"}</p>
                <Button onClick={handleAnalyze} disabled={!file || isAnalyzing}
                  className="gap-2 bg-purple-600 hover:bg-purple-700 text-white transition-colors">
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
            <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Brain className="h-5 w-5" />
                  Analysis Results
                </CardTitle>
                <CardDescription>Alzheimer's disease detection results</CardDescription>
              </CardHeader>
              {/* <ScrollArea className="h-[500px]"> */}
              <CardContent>
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <Brain className="h-16 w-16 animate-pulse text-purple-400" />
                    <p className="text-center font-medium text-purple-700">Analyzing MRI scan...</p>
                    <Progress value={45} className="w-full max-w-[300px] bg-purple-100" />
                  </div>
                ) : result ? (
                  <div className="space-y-6">

                    <div className="rounded-lg bg-purple-50 p-4 border border-purple-100">
                      <div className="mb-2 text-sm font-medium text-purple-700">Diagnosis</div>
                      <div className="text-2xl font-bold text-purple-900">{result.prediction_class}</div>
                      <div className="mt-1 text-sm text-purple-600">
                        Confidence: {(result.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 text-sm font-medium text-purple-700">Medical Explanation</div>
                      <Markdown markdown={result.analysis} />
                    </div>

                    <div>
                      <div className="mb-2 text-sm font-medium text-purple-700">Confidence Score</div>
                      <div className="flex items-center gap-4">
                        <Progress value={result.confidence * 100} className="w-full bg-purple-100" />
                        <span className="text-sm font-medium text-purple-700">{(result.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                    <Brain className="h-16 w-16 text-purple-200" />
                    <p className="font-medium text-purple-700">Upload and analyze an MRI scan to see results</p>
                    <p className="text-sm text-purple-600">
                      The analysis will provide a diagnosis with confidence score and medical explanation
                    </p>
                  </div>
                )}
              </CardContent>
              {/* </ScrollArea> */}
            </Card>
          </div>
        </TabsContent >

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>Your previous Alzheimer's disease analyses</CardDescription>
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
              <CardTitle>About Alzheimer's Disease Detection</CardTitle>
              <CardDescription>How our AI model detects Alzheimer's disease</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our Alzheimer's disease detection model analyzes brain MRI scans to identify patterns associated with
                different stages of Alzheimer's disease. The model has been trained on thousands of labeled MRI scans
                and can classify results into four categories:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Non Dementia:</strong> No significant signs of Alzheimer's disease or dementia.
                </li>
                <li>
                  <strong>Very Mild Dementia:</strong> Early signs of cognitive decline that may indicate the beginning
                  stages of Alzheimer's.
                </li>
                <li>
                  <strong>Mild Dementia:</strong> Clear signs of Alzheimer's disease with noticeable cognitive
                  impairment.
                </li>
                <li>
                  <strong>Moderate Dementia:</strong> Advanced Alzheimer's disease with significant cognitive decline.
                </li>
              </ul>

              <p>The model analyzes various features in the MRI scan, including:</p>

              <ul className="list-disc pl-6 space-y-2">
                <li>Hippocampal volume and atrophy</li>
                <li>Ventricle size and expansion</li>
                <li>Cortical thickness</li>
                <li>White matter integrity</li>
                <li>Overall brain volume changes</li>
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
      </Tabs >
    </div >
  )
}
