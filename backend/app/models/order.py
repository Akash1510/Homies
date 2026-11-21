from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    quantity: int
    unit: str

class OrderCreate(BaseModel):
    user_id: Optional[str] = None
    customer_name: str
    phone: str
    email: Optional[str] = None
    address: str
    city: str
    pincode: str
    items: List[OrderItem]
    subtotal: float
    delivery_charge: float = 0.0
    discount: float = 0.0
    total: float
    payment_method: str = "WHATSAPP" # "RAZORPAY", "WHATSAPP", "COD"
    razorpay_payment_id: Optional[str] = None
    razorpay_order_id: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: str # "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"

class OrderResponse(BaseModel):
    id: str
    order_id: str
    user_id: Optional[str] = None
    customer_name: str
    phone: str
    email: Optional[str] = None
    address: str
    city: str
    pincode: str
    items: List[OrderItem]
    subtotal: float
    delivery_charge: float
    discount: float
    total: float
    payment_method: str
    payment_status: str
    status: str
    razorpay_payment_id: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class RazorpayCreateOrderRequest(BaseModel):
    amount: float # in rupees
    currency: str = "INR"
    receipt: Optional[str] = None

class RazorpayVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
