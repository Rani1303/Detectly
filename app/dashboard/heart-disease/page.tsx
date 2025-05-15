"use client"

import type React from "react"

import { useState } from "react"
import { Heart, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import Markdown from "@/components/markdown"
export default function HeartDiseasePage() {
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    cp: "",
    trtbps: "",
    chol: "",
    restecg: "",
    thalachh: "",
    exng: "",
    oldpeak: "",
    slp: "",
    caa: "",
    thall: "",
    o2Saturation: "",
  })

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAnalyze = async () => {
    if (!isFormValid()) return

    setIsAnalyzing(true)
    try {
      const analysisResponse = await fetch('/api/analyze/heart-disease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze data')
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
    setFormData({
      age: "",
      sex: "",
      cp: "",
      trtbps: "",
      chol: "",
      restecg: "",
      thalachh: "",
      exng: "",
      oldpeak: "",
      slp: "",
      caa: "",
      thall: "",
      o2Saturation: "",
    })
    setResult(null)
  }

  const isFormValid = () => {
    return (
      formData.age &&
      formData.sex &&
      formData.cp &&
      formData.trtbps &&
      formData.chol &&
      formData.restecg &&
      formData.thalachh &&
      formData.exng &&
      formData.slp &&
      formData.caa &&
      formData.thall
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-900">Heart Disease Risk Assessment</h1>
        <p className="text-muted-foreground">Enter patient data to assess heart disease risk</p>
      </div>

      <Tabs defaultValue="input" className="space-y-4">
        <TabsList className="bg-red-50">
          <TabsTrigger value="input" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">Input Data</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">Assessment History</TabsTrigger>
          <TabsTrigger value="info" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900">Information</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="min-h-[400px] transition-all duration-300 hover:shadow-lg hover:shadow-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Heart className="h-5 w-5" />
                  Patient Data Input
                </CardTitle>
                <CardDescription>Enter patient data for heart disease risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-red-700">Age</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        placeholder="e.g. 45"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sex" className="text-red-700">Sex</Label>
                      <Select value={formData.sex} onValueChange={(value) => handleSelectChange("sex", value)}>
                        <SelectTrigger id="sex" className="border-red-200 focus:ring-red-400">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Female</SelectItem>
                          <SelectItem value="1">Male</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cp" className="text-red-700">Chest Pain Type</Label>
                    <Select value={formData.cp} onValueChange={(value) => handleSelectChange("cp", value)}>
                      <SelectTrigger id="cp" className="border-red-200 focus:ring-red-400">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Typical Angina</SelectItem>
                        <SelectItem value="1">Atypical Angina</SelectItem>
                        <SelectItem value="2">Non-anginal Pain</SelectItem>
                        <SelectItem value="3">Asymptomatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trtbps" className="text-red-700">Resting Blood Pressure (mm Hg)</Label>
                      <Input
                        id="trtbps"
                        name="trtbps"
                        type="number"
                        placeholder="e.g. 120"
                        value={formData.trtbps}
                        onChange={handleInputChange}
                        className="border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chol" className="text-red-700">Cholesterol (mg/dl)</Label>
                      <Input
                        id="chol"
                        name="chol"
                        type="number"
                        placeholder="e.g. 200"
                        value={formData.chol}
                        onChange={handleInputChange}
                        className="border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="restecg" className="text-red-700">Resting ECG</Label>
                      <Select value={formData.restecg} onValueChange={(value) => handleSelectChange("restecg", value)}>
                        <SelectTrigger id="restecg" className="border-red-200 focus:ring-red-400">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Normal</SelectItem>
                          <SelectItem value="1">ST-T Wave Abnormality</SelectItem>
                          <SelectItem value="2">Left Ventricular Hypertrophy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thalachh" className="text-red-700">Max Heart Rate</Label>
                      <Input
                        id="thalachh"
                        name="thalachh"
                        type="number"
                        placeholder="e.g. 150"
                        value={formData.thalachh}
                        onChange={handleInputChange}
                        className="border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exng" className="text-red-700">Exercise Induced Angina</Label>
                      <Select value={formData.exng} onValueChange={(value) => handleSelectChange("exng", value)}>
                        <SelectTrigger id="exng" className="border-red-200 focus:ring-red-400">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No</SelectItem>
                          <SelectItem value="1">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oldpeak" className="text-red-700">ST Depression (Exercise vs Rest)</Label>
                      <Input
                        id="oldpeak"
                        name="oldpeak"
                        type="number"
                        step="0.1"
                        placeholder="e.g. 1.2"
                        value={formData.oldpeak}
                        onChange={handleInputChange}
                        className="border-red-200 focus:border-red-400 focus:ring-red-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slp" className="text-red-700">Slope of Peak Exercise ST</Label>
                      <Select value={formData.slp} onValueChange={(value) => handleSelectChange("slp", value)}>
                        <SelectTrigger id="slp" className="border-red-200 focus:ring-red-400">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Upsloping</SelectItem>
                          <SelectItem value="1">Flat</SelectItem>
                          <SelectItem value="2">Downsloping</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="caa" className="text-red-700">Number of Major Vessels</Label>
                      <Select value={formData.caa} onValueChange={(value) => handleSelectChange("caa", value)}>
                        <SelectTrigger id="caa" className="border-red-200 focus:ring-red-400">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thall" className="text-red-700">Thalassemia</Label>
                      <Select value={formData.thall} onValueChange={(value) => handleSelectChange("thall", value)}>
                        <SelectTrigger id="thall" className="border-red-200 focus:ring-red-400">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Normal</SelectItem>
                          <SelectItem value="1">Fixed Defect</SelectItem>
                          <SelectItem value="2">Reversible Defect</SelectItem>
                          <SelectItem value="3">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="o2Saturation" className="text-red-700">O2 Saturation (%)</Label>
                    <Input
                      id="o2Saturation"
                      name="o2Saturation"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 98.5"
                      value={formData.o2Saturation}
                      onChange={handleInputChange}
                      className="border-red-200 focus:border-red-400 focus:ring-red-400"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetAnalysis}
                  className="border-red-200 hover:bg-red-50 hover:text-red-700">
                  Reset
                </Button>
                <Button onClick={handleAnalyze} disabled={!isFormValid() || isAnalyzing}
                  className="gap-2 bg-red-600 hover:bg-red-700 text-white transition-colors">
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

              <Card className="min-h-[400px] transition-all duration-300 hover:shadow-lg hover:shadow-red-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <Heart className="h-5 w-5" />
                    Assessment Results
                  </CardTitle>
                  <CardDescription>Heart disease risk assessment results</CardDescription>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                      <Heart className="h-16 w-16 animate-pulse text-red-400" />
                      <p className="text-center font-medium text-red-700">Analyzing patient data...</p>
                      <Progress value={35} className="w-full max-w-[300px] bg-red-100" />
                    </div>
                  ) : result ? (
                    <div className="space-y-6">
                      <div className="rounded-lg bg-red-50 p-4 border border-red-100">
                        <div className="mb-2 text-sm font-medium text-red-700">Risk Assessment</div>
                        <div className="text-2xl font-bold text-red-900">
                          {result.confidence < 0.5 ? "Low Risk" : "High Risk"}
                        </div>
                        <div className="mt-1 text-sm text-red-600">
                          Confidence: {(result.confidence * 100).toFixed(1)}%
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 text-sm font-medium text-red-700">Medical Explanation</div>
                        <Markdown markdown={result.explanation} />
                      </div>

                      <div>
                        <div className="mb-2 text-sm font-medium text-red-700">Risk Score</div>
                        <div className="flex items-center gap-4">
                          <Progress value={result.confidence * 100} className="w-full bg-red-100" />
                          <span className="text-sm font-medium text-red-700">{(result.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                      <Heart className="h-16 w-16 text-red-200" />
                      <p className="font-medium text-red-700">Enter patient data to see risk assessment</p>
                      <p className="text-sm text-red-600">
                        The analysis will provide a heart disease risk assessment with detailed explanation
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            {/* </ScrollArea> */}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
              <CardDescription>Your previous heart disease risk assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No previous assessments found</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Heart Disease Risk Assessment</CardTitle>
              <CardDescription>How our AI model assesses heart disease risk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our heart disease risk assessment model analyzes patient data to evaluate the risk of heart disease. The
                model has been trained on a comprehensive dataset of patient records and can provide a risk assessment
                with confidence score.
              </p>

              <p>The model analyzes various patient parameters, including:</p>

              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Age and Sex:</strong> Demographic factors that influence heart disease risk
                </li>
                <li>
                  <strong>Chest Pain Type:</strong> The type and severity of chest pain experienced
                </li>
                <li>
                  <strong>Resting Blood Pressure:</strong> Blood pressure when at rest
                </li>
                <li>
                  <strong>Cholesterol Levels:</strong> Serum cholesterol in mg/dl
                </li>
                <li>
                  <strong>Resting ECG Results:</strong> Electrocardiogram results at rest
                </li>
                <li>
                  <strong>Maximum Heart Rate:</strong> Maximum heart rate achieved during exercise
                </li>
                <li>
                  <strong>Exercise Induced Angina:</strong> Whether exercise induces chest pain
                </li>
                <li>
                  <strong>ST Depression:</strong> ST depression induced by exercise relative to rest
                </li>
                <li>
                  <strong>Slope of Peak Exercise ST:</strong> The slope of the peak exercise ST segment
                </li>
                <li>
                  <strong>Number of Major Vessels:</strong> Number of major vessels colored by fluoroscopy
                </li>
                <li>
                  <strong>Thalassemia:</strong> A blood disorder that affects the body's ability to produce hemoglobin
                </li>
                <li>
                  <strong>O2 Saturation:</strong> Oxygen saturation level in the blood
                </li>
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
