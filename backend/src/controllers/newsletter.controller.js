import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import { AppError } from '../middleware/errorHandler.js';

export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email, consent = true } = req.body;

    if (!email) {
      return next(new AppError('Email is required.', 400));
    }

    const normalizedEmail = email.toLowerCase().trim();

    let subscriber = await NewsletterSubscriber.findOne({ email: normalizedEmail });

    if (subscriber) {
      subscriber.active = true;
      subscriber.consent = consent;
      await subscriber.save();
    } else {
      subscriber = await NewsletterSubscriber.create({
        email: normalizedEmail,
        consent,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscribed successfully.',
      data: { subscriber },
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: { subscribers },
    });
  } catch (error) {
    next(error);
  }
};

export const unsubscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError('Email is required.', 400));
    }

    const normalizedEmail = email.toLowerCase().trim();

    const subscriber = await NewsletterSubscriber.findOne({ email: normalizedEmail });

    if (!subscriber) {
      return next(new AppError('Subscriber not found.', 404));
    }

    subscriber.active = false;
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'Unsubscribed successfully.',
    });
  } catch (error) {
    next(error);
  }
};