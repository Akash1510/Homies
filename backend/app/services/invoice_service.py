import os
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from backend.app.core.config import settings

logger = logging.getLogger("homies.invoice")

class InvoiceService:
    """
    Automated GST-Compliant Tax Invoice PDF Generator for Homies Clean.
    Generates downloadable PDF invoices stored in public/invoices.
    """
    def __init__(self, output_dir: Optional[str] = None):
        self.output_dir = Path(output_dir or settings.INVOICE_STORAGE_DIR)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def generate_invoice(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Builds a professional tax invoice PDF and saves to storage.
        """
        order_id = order_data.get("order_id") or order_data.get("id", "UNKNOWN")
        invoice_no = f"INV-{datetime.utcnow().strftime('%Y%m')}-{order_id[-6:]}"
        filename = f"invoice_{order_id}.pdf"
        file_path = self.output_dir / filename

        doc = SimpleDocTemplate(
            str(file_path),
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36,
        )

        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            "InvoiceTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=26,
            textColor=colors.HexColor("#0284c7"), # Sky-600
        )
        subtitle_style = ParagraphStyle(
            "InvoiceSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#64748b"), # Slate-500
        )
        header_meta = ParagraphStyle(
            "HeaderMeta",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#334155"),
            alignment=2, # Right align
        )
        section_heading = ParagraphStyle(
            "SectionHeading",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=colors.HexColor("#0f172a"),
        )
        body_text = ParagraphStyle(
            "BodyText",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#334155"),
        )
        table_cell = ParagraphStyle(
            "TableCell",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#1e293b"),
        )
        table_cell_bold = ParagraphStyle(
            "TableCellBold",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#0f172a"),
        )

        story = []

        # 1. Header Banner
        header_data = [
            [
                Paragraph("<b>HOMIES CLEAN</b><br/><font size=8>Sparkling Clean Homes Made Effortless</font>", title_style),
                Paragraph(
                    f"<b>TAX INVOICE</b><br/>"
                    f"Invoice No: <b>{invoice_no}</b><br/>"
                    f"Date: {datetime.utcnow().strftime('%d %b %Y')}<br/>"
                    f"Order ID: <b>{order_id}</b>",
                    header_meta
                ),
            ]
        ]
        header_table = Table(header_data, colWidths=[300, 240])
        header_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 10))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=15))

        # 2. Seller and Buyer Details
        seller_text = (
            f"<b>Sold By:</b><br/>"
            f"<b>Homies Clean Direct Supplies</b><br/>"
            f"Store Admin: Akash<br/>"
            f"GSTIN: {settings.STORE_GSTIN}<br/>"
            f"Email: {settings.ADMIN_EMAIL}<br/>"
            f"Helpline: {settings.ADMIN_PHONE}"
        )
        buyer_text = (
            f"<b>Billed & Shipped To:</b><br/>"
            f"<b>{order_data.get('customer_name', 'Customer')}</b><br/>"
            f"Phone: {order_data.get('phone', 'N/A')}<br/>"
            f"Email: {order_data.get('email', 'N/A')}<br/>"
            f"Address: {order_data.get('address', 'N/A')}<br/>"
            f"{order_data.get('city', '')} - {order_data.get('pincode', '')}"
        )

        party_table = Table(
            [[Paragraph(seller_text, body_text), Paragraph(buyer_text, body_text)]],
            colWidths=[270, 270]
        )
        party_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ("TOPPADDING", (0, 0), (-1, -1), 10),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ("LEFTPADDING", (0, 0), (-1, -1), 12),
            ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ]))
        story.append(party_table)
        story.append(Spacer(1, 15))

        # 3. Itemized Products Table
        items_data = [
            [
                Paragraph("<b>#</b>", table_cell_bold),
                Paragraph("<b>Item Description</b>", table_cell_bold),
                Paragraph("<b>HSN</b>", table_cell_bold),
                Paragraph("<b>Qty</b>", table_cell_bold),
                Paragraph("<b>Unit Price</b>", table_cell_bold),
                Paragraph("<b>Amount (INR)</b>", table_cell_bold),
            ]
        ]

        items = order_data.get("items", [])
        for idx, item in enumerate(items, 1):
            name = item.get("name", "Cleaning Supply")
            qty = item.get("quantity", 1)
            price = item.get("price", 0.0)
            item_total = price * qty
            items_data.append([
                Paragraph(str(idx), table_cell),
                Paragraph(name, table_cell),
                Paragraph("3402", table_cell), # Organic surface-active agents HSN
                Paragraph(str(qty), table_cell),
                Paragraph(f"₹{price:.2f}", table_cell),
                Paragraph(f"₹{item_total:.2f}", table_cell),
            ])

        items_table = Table(items_data, colWidths=[30, 250, 50, 40, 80, 90])
        items_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("LINEBELOW", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ("ALIGN", (2, 0), (-1, -1), "RIGHT"),
        ]))
        story.append(items_table)
        story.append(Spacer(1, 12))

        # 4. Calculation Breakdown
        subtotal = float(order_data.get("subtotal") or 0.0)
        delivery = float(order_data.get("delivery_charge") or 0.0)
        discount = float(order_data.get("discount") or 0.0)
        total = float(order_data.get("total") or 0.0)
        
        # Approximate 18% GST included
        taxable_val = round(total / 1.18, 2)
        gst_total = round(total - taxable_val, 2)
        cgst = round(gst_total / 2, 2)
        sgst = round(gst_total / 2, 2)

        summary_data = [
            ["Subtotal:", f"₹{subtotal:.2f}"],
            ["Delivery / Shipping:", f"₹{delivery:.2f}" if delivery > 0 else "FREE"],
            ["Promotional Discount:", f"-₹{discount:.2f}" if discount > 0 else "₹0.00"],
            ["Taxable Value:", f"₹{taxable_val:.2f}"],
            ["CGST (9%):", f"₹{cgst:.2f}"],
            ["SGST (9%):", f"₹{sgst:.2f}"],
            ["Grand Total:", f"₹{total:.2f}"],
        ]

        summary_table = Table(
            [[Paragraph("", body_text), Table(summary_data, colWidths=[140, 90])]],
            colWidths=[310, 230]
        )
        summary_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ]))
        story.append(summary_table)
        story.append(Spacer(1, 15))

        # 5. Payment & Verification Metadata
        pay_method = order_data.get("payment_method", "COD")
        pay_status = order_data.get("payment_status", "PENDING")
        rzp_pay_id = order_data.get("razorpay_payment_id") or "N/A"

        pay_box = (
            f"<b>Payment Mode:</b> {pay_method} | "
            f"<b>Status:</b> {pay_status} | "
            f"<b>Transaction Ref:</b> {rzp_pay_id}<br/>"
            f"<font color='#64748b' size=8>This is a computer-generated tax invoice. No physical signature required.</font>"
        )
        pay_table = Table([[Paragraph(pay_box, body_text)]], colWidths=[540])
        pay_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("PADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(pay_table)

        # Build document
        doc.build(story)
        logger.info(f"✅ Generated Tax Invoice PDF: {file_path} (Invoice: {invoice_no})")

        return {
            "invoice_url": f"/invoices/{filename}",
            "invoice_number": invoice_no,
            "file_path": str(file_path),
            "order_id": order_id,
        }

# Global singleton service
invoice_service = InvoiceService()
