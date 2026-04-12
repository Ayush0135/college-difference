def calculate_roi(placement_median: float, total_fees: float) -> float:
    """
    ROI Logic: (Placement_Median / Total_Fees)
    """
    if total_fees <= 0:
        return 0.0
    return placement_median / total_fees
