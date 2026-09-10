package com.cryptovaultx.service;

import com.cryptovaultx.entity.TaxRecord;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    public String generateTaxReportCsv(List<TaxRecord> records) {
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Date,Token,Type,Quantity,Price_INR,Total_Value_INR,TDS_INR,Profit_Loss_INR,Tax_INR\n");
        
        for (TaxRecord record : records) {
            csv.append(record.getId()).append(",");
            csv.append(record.getCreatedAt()).append(",");
            csv.append(record.getToken().getSymbol()).append(",");
            csv.append(record.getTransactionType()).append(",");
            csv.append(record.getQuantity()).append(",");
            csv.append(record.getPriceInr()).append(",");
            csv.append(record.getTotalValueInr()).append(",");
            csv.append(record.getTdsAmountInr()).append(",");
            csv.append(record.getProfitLossInr()).append(",");
            csv.append(record.getTaxAmountInr()).append("\n");
        }
        
        return csv.toString();
    }
}
