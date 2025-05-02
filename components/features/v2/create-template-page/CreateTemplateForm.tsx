"use client";

import React, { useState } from "react";
import {
  Card,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from "@/components/shared";
import TemplateDetailsStep from "./steps/TemplateDetailsStep";
import TradesAndElementsStep from "./steps/TradesAndElementsStep";
import PreviewStep from "./steps/PreviewStep";
import StepIndicator from "./StepIndicator";
import { TemplateCreateRequest } from "@/types/templates/dto";
import { TradeResponse } from "@/types/trades/dto";
import { VariableResponse } from "@/types/variables/dto";
import { ElementResponse } from "@/types/elements/dto";

const CreateTemplateForm = () => {
  const [currentStep, setCurrentStep] = useState<string>("details");
  const [formData, setFormData] = useState<TemplateCreateRequest>({
    name: "",
    description: "",
    status: "draft",
    origin: "original",
    source_id: "",
    owner: "",
    trades: [], 
    variables: [], 
    is_public: false,
  });

  const [tradeObjects, setTradeObjects] = useState<TradeResponse[]>([]);
  const [variableObjects, setVariableObjects] = useState<VariableResponse[]>(
    []
  );

  const updateFormData = (field: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleNext = () => {
    if (currentStep === "details") {
      setCurrentStep("trades");
    } else if (currentStep === "trades") {
      setCurrentStep("preview");
    }
  };

  const handleBack = () => {
    if (currentStep === "trades") {
      setCurrentStep("details");
    } else if (currentStep === "preview") {
      setCurrentStep("trades");
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedFormData = {
        ...formData,
        trades: tradeObjects.map(trade => trade.id),
        variables: variableObjects.map(variable => variable.id)
      };
      
      const requestPayload = {
        name: updatedFormData.name,
        description: updatedFormData.description,
        status: updatedFormData.status,
        origin: updatedFormData.origin,
        trades: updatedFormData.trades,
        variables: updatedFormData.variables
      };

      console.log("Submitting template:", requestPayload);
      alert("Template created successfully!");
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };

  return (
    <Card className="w-full">
      <div className="p-6 border-b">
        <StepIndicator
          steps={["Template Details", "Trades & Elements", "Preview"]}
          currentStep={
            currentStep === "details" ? 0 : currentStep === "trades" ? 1 : 2
          }
        />
      </div>

      <Tabs value={currentStep} className="w-full">
        <TabsContent value="details" className="p-6">
          <TemplateDetailsStep
            data={{
              name: formData.name,
              description: formData.description || "",
            }}
            updateData={(data) => updateFormData("details", data)}
          />
          <div className="flex justify-end mt-6">
            <Button onClick={handleNext}>Next: Trades & Elements</Button>
          </div>
        </TabsContent>

        <TabsContent value="trades" className="p-6">
          <TradesAndElementsStep
            data={{
              trades: tradeObjects,
              variables: variableObjects,
            }}
            updateTrades={(trades) => {
              setTradeObjects(trades);
              updateFormData(
                "trades",
                trades.map((trade) => trade.id)
              );
            }}
            updateVariables={(variables) => {
              setVariableObjects(variables);
              updateFormData(
                "variables",
                variables.map((variable) => variable.id)
              );
            }}
          />
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext}>Next: Preview</Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="p-6">
          <PreviewStep data={formData} tradeObjects={tradeObjects} variableObjects={variableObjects} />
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleSubmit}>Create Template</Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default CreateTemplateForm;
