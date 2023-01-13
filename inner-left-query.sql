/****** Object:  StoredProcedure [BH].[GetGroupTenderSites]    Script Date: 13/01/2023 10:45:05 am ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--SET QUOTED_IDENTIFIER ON|OFF
--SET ANSI_NULLS ON|OFF
--GO
ALTER PROCEDURE [BH].[GetGroupTenderSites] @GroupTenderId AS INT
-- WITH ENCRYPTION, RECOMPILE, EXECUTE AS CALLER|SELF|OWNER| 'user_name'
AS
    BEGIN
        SELECT
			[JR].[OppId]																		AS OpportunityId,
			[GT].[GroupName]																	AS [GroupName],
			[CD].[CompanyName]																	AS [JobName],
			[JR].[JobStage]																		AS [Status],
			COALESCE([LME].[RetailerName], [SME].[RetailerName])								AS [Retailer],
			COALESCE([LME].[Months], [SME].[ContractTerm])										AS [Terms],
			[JR].[ContractStartDate]															AS [ContractStartDate],
			CONVERT(VARCHAR(MAX), COALESCE([LME].[EndDate], [SME].[EndDate]), 126)				AS [ContractEndDate],
			CONVERT(VARCHAR(MAX), [JR].[DueDate], 126)											AS [TenderCloseDate],
			CONVERT(VARCHAR(MAX), COALESCE([LME].[OfferExpiry], [SME].[OfferExpiry]), 126)		AS [OfferExpiry],
			COALESCE([LME].[Consumption_PA], [SME].[TotalEnergyConsumption])					AS [AnnualUsage]
		FROM [dbo].[JobRequest] AS [JR]
		INNER JOIN [dbo].[GroupTender]              AS [GT] ON [GT].[GroupTenderID] = [JR].[GroupTender]
		INNER JOIN [dbo].[ClientDetails]            AS [CD] ON [CD].[JobRequestId] = [JR].[JobRequestID]
		LEFT JOIN 
			(

				SELECT 
					[O].[OfferId], 
					[O].[JobRequestId], 
					[R].[RetailerName], 
					[OP].[Months], 
					[OP].[EndDate], 
					[O].[OfferExpiry], 
					[OTDC].[Consumption_PA] 
				FROM [dbo].[Offer] AS [O]
				INNER JOIN [dbo].[OfferPeriod] AS [OP] ON [OP].[OfferId] = [O].[OfferId] AND [OP].[isRecommended] = 1
				INNER JOIN [dbo].[OfferTermDetailsComputed] AS [OTDC] ON [OTDC].[OfferPeriodId] = [OP].[OfferPeriodId]
				INNER JOIN [dbo].[Retailer] AS [R] ON [R].[RetailerId] = [O].[RetailerId]
			) AS LME ON [LME].[JobRequestId] = [JR].[JobRequestID]
		LEFT JOIN 
			(
				SELECT 
					[OS].[OfferSmeId], 
					[OS].[JobRequestId], 
					[R].[RetailerName], 
					[OS].[ContractTerm], 
					[OS].[EndDate], 
					[OS].[OfferExpiry], 
					[OTDSC].[TotalEnergyConsumption] 
				FROM [dbo].[OfferSme] AS [OS]
				INNER JOIN [dbo].[OfferTermDetailsSmeComputed] AS [OTDSC] ON [OTDSC].[OfferSmeId] = [OS].[OfferSmeId]
				INNER JOIN [dbo].[Retailer] AS [R] ON [R].[RetailerId] = [OS].[RetailerId]
				WHERE [OS].[isRecommended] = 1
			) AS SME ON [SME].[JobRequestId] = [JR].[JobRequestID]
		WHERE [JR].[GroupTender] = @GroupTenderId
       
    END;
